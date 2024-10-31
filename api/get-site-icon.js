import fetch from 'node-fetch';

export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    const domain = new URL(url).hostname;
    const googleFaviconUrl = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=64`;
    const defaultFaviconUrl = `https://${domain}/favicon.ico`;

    try {
        const response = await fetch(googleFaviconUrl);
        if (response.ok) {
            return res.redirect(googleFaviconUrl);
        }
    } catch {}

    try {
        const response = await fetch(defaultFaviconUrl);
        if (response.ok) {
            return res.redirect(defaultFaviconUrl);
        }
    } catch {}

    res.redirect('/broken-image.png');
}
