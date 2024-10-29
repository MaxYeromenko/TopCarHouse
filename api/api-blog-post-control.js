const { BlogPostModel } = require('../server/db');

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { title, structure, author, tags, commentsEnabled } = req.body;

        if (!title || !structure || !author) {
            return res.status(400).json({ success: false, message: 'Будь ласка, заповніть всі обов\'язкові поля.' });
        }

        try {
            const newPost = new BlogPostModel({
                title,
                structure,
                author,
                tags,
                commentsEnabled
            });

            await newPost.save();
            res.status(201).json({ success: true, message: 'Статтю успішно опубліковано!' });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Помилка сервера під час публікації!' });
        }
    } else if (req.method === 'GET') {
        try {
            const { id, sortByDate, searchQuery, author, tags } = req.query;

            let filter = {};
            let sortOptions = { publishedDate: -1 };

            if (id) {
                filter._id = id;
            } else {
                if (author) {
                    const trimmedAuthor = author.trim();
                    if (trimmedAuthor.length > 0) {
                        filter.author = trimmedAuthor;
                    }
                }

                if (tags) {
                    const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
                    if (tagArray.length > 0) {
                        filter.tags = { $in: tagArray };
                    }
                }

                if (searchQuery) {
                    const searchRegex = new RegExp(searchQuery.trim(), 'i');
                    filter.$or = [
                        { title: searchRegex },
                        { 'structure.elementContent': searchRegex }
                    ];
                }

                if (sortByDate) {
                    sortOptions.publishedDate = sortByDate === 'true' ? 1 : -1;
                }
            }

            const posts = await BlogPostModel.find(filter).sort(sortOptions).populate({
                path: 'comments.commentator',
                select: 'name role'
            }).lean();

            posts.forEach(post => {
                if (post.comments && post.comments.length > 0) {
                    post.comments = post.comments.filter(comment => comment.commentator);
                    post.comments = post.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                }
            });

            res.status(200).json(posts);
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Помилка сервера під час отримання статей!' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Метод не дозволений!' });
    }
};
