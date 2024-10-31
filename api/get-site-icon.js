const fetch = require('node-fetch');

module.exports = async (req, res) => {
    if (req.method === 'GET') {
        const domain = req.query.domain;
        const googleFaviconUrl = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=64`;
        const defaultFaviconUrl = `https://${domain}/favicon.ico`;

        try {
            const response = await fetch(googleFaviconUrl);
            if (response.ok) {
                const faviconBuffer = await response.buffer();
                res.setHeader('Content-Type', 'image/png');
                return res.status(200).send(faviconBuffer);
            } else {
                throw new Error('Failed to fetch favicon from Google');
            }
        } catch (error) {
            console.error(error);

            try {
                const response = await fetch(defaultFaviconUrl);
                if (response.ok) {
                    const faviconBuffer = await response.buffer();
                    res.setHeader('Content-Type', 'image/x-icon');
                    return res.status(200).send(faviconBuffer);
                } else {
                    throw new Error('Failed to fetch favicon from default URL');
                }
            } catch (error) {
                console.error(error);
                res.status(404).json({ success: false, message: 'Favicon not found' });
            }
        }
    } else {
        res.status(405).json({ success: false, message: 'Метод не дозволений!' });
    }
};
