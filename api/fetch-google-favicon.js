import fetch from 'node-fetch';

export default async (req, res) => {
    const { domain } = req.query;
    if (!domain) {
        return res.status(400).json({ error: 'Domain parameter is required' });
    }

    const googleFaviconUrl = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=64`;

    try {
        const response = await fetch(googleFaviconUrl);

        if (response.ok) {
            return res.json({ domain });
        } else {
            return res.status(404).json({ error: 'Favicon not found' });
        }
    } catch (error) {
        console.error('Error fetching favicon:', error.message);
        res.status(500).json({ error: 'Error fetching favicon' });
    }
};
