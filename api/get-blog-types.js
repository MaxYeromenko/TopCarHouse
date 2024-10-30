const { BlogPostModel } = require('../server/db');

module.exports = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const posts = await BlogPostModel.find({}, 'author tags');

            const authors = [...new Set(posts.map(post => post.author))].sort();
            const tags = [...new Set(posts.flatMap(post => post.tags))].sort();

            res.status(200).json({ authors, tags });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Помилка сервера під час отримання даних постів!' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Метод не дозволений!' });
    }
};
