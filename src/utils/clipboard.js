export const copyCanvasToClipboard = async (canvas) => {
  if (!canvas) return false;
  
  try {
    const blob = await new Promise(resolve => canvas.toBlob(resolve));
    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob
      })
    ]);
    return true;
  } catch (err) {
    console.error('Failed to copy image: ', err);
    return false;
  }
};

export const copyUrlToClipboard = async (url) => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        await navigator.clipboard.write([
            new ClipboardItem({
                [blob.type]: blob
            })
        ]);
        return true;
    } catch (err) {
        console.error('Failed to copy from URL:', err);
        return false;
    }
}

export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy text:', err);
        return false;
    }
};
