module.exports = async (req, res) => {
    if (req.method === 'GET') {
        const domain = req.query.domain;
        const googleFaviconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;

        try {
            const response = await fetch(googleFaviconUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch favicon');
            }

            const faviconBuffer = await response.buffer();

            res.setHeader('Content-Type', 'image/png');
            res.status(200).send(faviconBuffer);
        } catch (error) {
            res.status(500).json({ success: false, message: 'Помилка сервера під час отримання даних авто!' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Метод не дозволений!' });
    }
};
