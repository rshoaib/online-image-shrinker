#!/usr/bin/env python3
"""Fix CP1252->UTF-8 mojibake in blog markdown files.

The original files were UTF-8 bytes (e.g. em-dash U+2014 = 0xE2 0x80 0x94)
that got read as Windows-1252 and re-saved as UTF-8 (producing 'ÔÇö' etc.).
Reversing it: encode the mojibake as Windows-1252, then decode as UTF-8.

We do this per-line per-character cluster so unrelated UTF-8 text stays put.
Idempotent: re-running on a clean file is a no-op.
"""
import sys
from pathlib import Path

# All known mojibake prefix bytes that signal a corrupted UTF-8 sequence.
# These are the Windows-1252 reinterpretations of the 0xC2/0xC3/0xE2 lead bytes
# you get from UTF-8.
LEAD_CHARS = set('ÂÃÔ├')

def looks_like_mojibake(s: str) -> bool:
    return any(c in LEAD_CHARS for c in s)

def try_fix(s: str) -> str:
    """Try to round-trip s through cp850->utf-8. Return fixed string or original."""
    try:
        fixed = s.encode('cp850', errors='strict').decode('utf-8', errors='strict')
    except (UnicodeEncodeError, UnicodeDecodeError):
        return s
    return fixed

def fix_text(text: str) -> tuple[str, int]:
    """Walk through the text and fix mojibake sequences.

    A mojibake cluster is a maximal run of chars starting with a LEAD_CHAR.
    We isolate it, try to fix, and emit. Single-character mojibake (e.g. naked Â)
    is left alone because it's ambiguous.
    """
    out = []
    i = 0
    n = len(text)
    fixes = 0
    while i < n:
        c = text[i]
        if c in LEAD_CHARS:
            j = i + 1
            # gobble follow-on chars that are part of the cluster
            # follow set: every char in the 0x80-0xff range (so multi-byte
            # mojibake clusters like 'ÔåÆ' = U+00D4 U+00E5 U+00C6 are captured).
            while j < n and 0x80 <= ord(text[j]) <= 0xff:
                j += 1
            cluster = text[i:j]
            fixed = try_fix(cluster)
            if fixed != cluster and len(fixed) < len(cluster):
                # only accept if it collapsed (real mojibake fix), avoids
                # accidentally mangling legit Â characters
                out.append(fixed)
                fixes += 1
            else:
                out.append(cluster)
            i = j
        else:
            out.append(c)
            i += 1
    return ''.join(out), fixes


def fix_file(path: Path) -> int:
    original = path.read_text(encoding='utf-8')
    if not looks_like_mojibake(original):
        return 0
    fixed, n = fix_text(original)
    if fixed == original:
        return 0
    with open(path, 'w', encoding='utf-8', newline='\n') as fh:
        fh.write(fixed)
    return n


def main():
    root = Path(__file__).resolve().parent.parent / 'src' / 'content' / 'blog'
    if not root.is_dir():
        print(f'ERROR: {root} not found', file=sys.stderr)
        sys.exit(1)
    files = sorted(root.glob('*.md'))
    total = 0
    touched = 0
    for f in files:
        n = fix_file(f)
        if n:
            print(f'  {f.name}: {n} clusters fixed')
            total += n
            touched += 1
    print(f'\nFixed {total} mojibake clusters across {touched} files (scanned {len(files)}).')

if __name__ == '__main__':
    main()
