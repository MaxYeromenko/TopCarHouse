// api/favicon.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    const domain = new URL(url).hostname;
    console.log(domain);
    const googleFaviconUrl = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=64`;
    const defaultFaviconUrl = `https://${domain}/favicon.ico`;

    try {
        // Проверяем фавикон от Google
        const googleResponse = await fetch(googleFaviconUrl);
        if (googleResponse.ok) {
            const contentType = googleResponse.headers.get('content-type');
            const arrayBuffer = await googleResponse.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer); // Преобразуем ArrayBuffer в Buffer
            res.setHeader('Content-Type', contentType); // Устанавливаем правильный заголовок
            return res.send(buffer);
        }
    } catch (error) {
        console.error('Error fetching Google favicon:', error);
    }

    try {
        // Проверяем стандартный фавикон
        const defaultResponse = await fetch(defaultFaviconUrl);
        if (defaultResponse.ok) {
            const contentType = defaultResponse.headers.get('content-type');
            const arrayBuffer = await defaultResponse.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer); // Преобразуем ArrayBuffer в Buffer
            res.setHeader('Content-Type', contentType); // Устанавливаем правильный заголовок
            return res.send(buffer);
        }
    } catch (error) {
        console.error('Error fetching default favicon:', error);
    }

    // Если оба запроса не удались, отправляем изображение с ошибкой
    res.redirect('/broken-image.png');
}
