const { BlogPostModel } = require('../server/db');

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { title, content, author, images, tags } = req.body;

        if (!title || !content || !author) {
            return res.status(400).json({ success: false, message: 'Будь ласка, заповніть всі обов\'язкові поля.' });
        }

        try {
            const newPost = new BlogPostModel({
                title,
                content,
                author,
                publishedDate: Date.now(),
                images: images || [],
                tags: tags || []
            });

            await newPost.save();
            res.status(201).json({ success: true, message: 'Статтю успішно опубліковано!' });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Помилка сервера під час публікації!' });
        }
    } else if (req.method === 'GET') {
        try {
            const posts = await BlogPostModel.find();
            res.status(200).json({ success: true, data: posts });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Помилка сервера під час отримання статей!' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Метод не дозволений!' });
    }
}