const { mongoose, BlogPostModel } = require('../server/db');

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { postId, id, commentText } = req.body;

        if (!postId || !id || !commentText) {
            return res.status(400).json({ success: false, message: 'Будь ласка, заповніть всі обов\'язкові поля.' });
        }

        try {
            const post = await BlogPostModel.findById(postId);
            if (!post) {
                return res.status(404).json({ success: false, message: 'Пост не знайдено!' });
            }

            post.comments.push({
                commentator: id,
                commentText
            });

            await post.save();
            res.json({ success: true, message: 'Коментар успішно опубліковано!' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Помилка сервера під час публікації!' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Метод не дозволений!' });
    }
};