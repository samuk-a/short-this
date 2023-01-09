const db = require('../database/config');
const { hashId } = require('../util/crypto');

class Shorter {
    async get(req, res) {
        const { id } = req.params;

        const [rows, _] = await db.execute(
            'SELECT * FROM urls WHERE (id = ? OR custom_path = ?) AND expires > CURRENT_TIMESTAMP ORDER BY expires DESC LIMIT 1',
            [id, id]
        );
        if (rows.length == 0) {
            return res.status(404).json({message: 'URL not found or expired'});
        }

        return res.status(200).json({message: 'URL Found!', url: rows[0].url});
    }

    async short(req, res) {
        const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:8080';

        const { url, customPath } = req.body;

        if (customPath) {
            const [rows, _] = await db.execute(
                'SELECT * FROM urls WHERE custom_path = ? AND expires > CURRENT_TIMESTAMP ORDER BY expires DESC LIMIT 1',
                [customPath]
            );
            if (rows.length > 0) {
                return res.status(400).json({message: '`customPath` already exists!'});
            }
        }
        const id = await hashId();
        const [rows, _] = await db.execute(
            'INSERT INTO urls (id, url, expires, custom_path) VALUES (?, ?, NOW()+INTERVAL 1 DAY, ?)',
            [id, url, customPath ?? null]
        );
        if (!rows.affectedRows) {
            console.error(rows);
            return res.status(500).json({message: 'Saving error!'});
        }
        return res.status(201).json({message: 'URL Shortened', url: `${BASE_URL}/${customPath || id}`});
    }
}

module.exports = new Shorter();