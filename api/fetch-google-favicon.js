const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const { domain } = req.query;
    const googleFaviconUrl = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=64`;

    try {
        const response = await fetch(googleFaviconUrl);
        if (response.ok) {
            const buffer = await response.buffer();
            res.set('Content-Type', 'image/png');
            return res.send(buffer);
        }
        res.status(404).send('Favicon not found');
    } catch (error) {
        res.status(500).send('Error fetching favicon');
    }
};