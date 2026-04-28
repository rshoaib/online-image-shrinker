import 'server-only';
import fs from 'fs';
import path from 'path';

// Directory holding hardcoded blog posts as .md files with YAML frontmatter.
// Format produced by the Supabase -> markdown migration:
//   ---
//   id: 1
//   slug: "my-slug"
//   title: "..."
//   tags: ["a", "b"]
//   meta_title: null
//   ---
//   markdown body...
const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blog');

// Decode a double-quoted scalar emitted by our converter.
// Handles \\, \", \n, \r, \t escapes.
function decodeQuotedString(raw) {
    if (raw.length < 2 || raw[0] !== '"' || raw[raw.length - 1] !== '"') {
        throw new Error(`Malformed quoted scalar: ${raw}`);
    }
    const inner = raw.slice(1, -1);
    let out = '';
    for (let i = 0; i < inner.length; i++) {
        const ch = inner[i];
        if (ch === '\\' && i + 1 < inner.length) {
            const next = inner[i + 1];
            if (next === 'n') out += '\n';
            else if (next === 'r') out += '\r';
            else if (next === 't') out += '\t';
            else if (next === '"') out += '"';
            else if (next === '\\') out += '\\';
            else out += next;
            i++;
        } else {
            out += ch;
        }
    }
    return out;
}

function parseScalar(raw) {
    const trimmed = raw.trim();
    if (trimmed === 'null') return null;
    if (trimmed === 'true') return true;
    if (trimmed === 'false') return false;
    if (/^-?\d+$/.test(trimmed)) return parseInt(trimmed, 10);
    if (/^-?\d+\.\d+$/.test(trimmed)) return parseFloat(trimmed);
    if (trimmed.startsWith('"')) return decodeQuotedString(trimmed);
    // Fallback: bare string
    return trimmed;
}

function parseInlineList(raw) {
    const trimmed = raw.trim();
    if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) {
        throw new Error(`Malformed inline list: ${raw}`);
    }
    const body = trimmed.slice(1, -1).trim();
    if (body === '') return [];
    // Split on commas that are NOT inside a quoted string.
    const items = [];
    let buf = '';
    let inQuote = false;
    for (let i = 0; i < body.length; i++) {
        const ch = body[i];
        if (ch === '"' && body[i - 1] !== '\\') inQuote = !inQuote;
        if (ch === ',' && !inQuote) {
            items.push(buf);
            buf = '';
        } else {
            buf += ch;
        }
    }
    if (buf.length > 0) items.push(buf);
    return items.map(parseScalar);
}

function parseFrontmatter(text) {
    // text is everything between the opening and closing --- markers
    const lines = text.split(/\r?\n/);
    const data = {};
    for (const line of lines) {
        if (line.trim() === '') continue;
        const colonIdx = line.indexOf(':');
        if (colonIdx === -1) continue;
        const key = line.slice(0, colonIdx).trim();
        const rawValue = line.slice(colonIdx + 1).trim();
        if (rawValue.startsWith('[')) {
            data[key] = parseInlineList(rawValue);
        } else {
            data[key] = parseScalar(rawValue);
        }
    }
    return data;
}

function parseMarkdownFile(raw) {
    // Expect file to start with "---\n"
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (!match) {
        throw new Error('File missing YAML frontmatter');
    }
    const frontmatter = parseFrontmatter(match[1]);
    const content = match[2] || '';
    return { ...frontmatter, content };
}

let _cache = null;

function loadAllPostsUncached() {
    if (!fs.existsSync(BLOG_DIR)) return [];
    const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));
    const posts = [];
    for (const file of files) {
        const full = path.join(BLOG_DIR, file);
        const raw = fs.readFileSync(full, 'utf-8');
        try {
            const post = parseMarkdownFile(raw);
            // Defensive: derive slug from filename if missing.
            if (!post.slug) post.slug = file.replace(/\.md$/, '');
            posts.push(post);
        } catch (err) {
            console.error(`Failed to parse blog post ${file}:`, err);
        }
    }
    return posts;
}

function getCache() {
    if (_cache) return _cache;
    const posts = loadAllPostsUncached();
    // Sort newest-first by `date` so callers get a sensible default order.
    posts.sort((a, b) => {
        const ta = a.date ? new Date(a.date).getTime() : 0;
        const tb = b.date ? new Date(b.date).getTime() : 0;
        return (isNaN(tb) ? 0 : tb) - (isNaN(ta) ? 0 : ta);
    });
    const bySlug = new Map(posts.map((p) => [p.slug, p]));
    _cache = { posts, bySlug };
    return _cache;
}

export function getAllPosts() {
    return getCache().posts;
}

export function getPostBySlug(slug) {
    return getCache().bySlug.get(slug) || null;
}

export function getAllSlugs() {
    return getCache().posts.map((p) => p.slug);
}
