module.exports = (req, res) => {
    if (req.method === 'GET') {
        try {
            const { token } = req.query;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('1'+token);
            console.log('2'+process.env.JWT_SECRET);
            console.log('3'+decoded);
            

            if (!decoded) {
                return res.status(401).json({ success: false, message: ' ' });
            }

            res.json({ success: true, user: decoded, message: ' ' });
        } catch (err) {
            res.status(500).json({ success: false, message: ' ' });
        }
    } else {
        res.status(405).json({ success: false, message: ' ' });
    }
};
