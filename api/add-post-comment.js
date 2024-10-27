module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { postId, userId, commentText } = req.body;

        if (!postId || !userId || !commentText) {
            return res.status(400).json({ success: false, message: 'Будь ласка, заповніть всі обов\'язкові поля.' });
        }

        try {
            const post = await BlogPost.findById(postId);
            if (!post) {
                return res.status(404).json({ success: false, message: 'Пост не знайдено!' });
            }

            post.comments.push({
                commentator: userId,
                commentText
            });

            await post.save();
            res.json({ success: true, message: 'Коментар успішно опубліковано!' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Помилка сервера під час публікації!' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Метод не дозволений!' });
    }
};