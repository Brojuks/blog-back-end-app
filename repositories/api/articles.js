const { Articles } = require('../../models')
const { Users } = require('../../models')

module.exports = {
    async AllArticles() {
        return await Articles.findAll({
            include: {
                model: Users,
                attributes: ['username']
            }
        })
    },
    async getLastSixArticles() {
        return await Articles.findAll({
            order: [['createdAt', 'DESC']],
            limit: 6,
            include: {
                model: Users,
                attributes: ['username']
            }
        })
    },
    async getArticleById(id) {
        return await Articles.findOne({
            where: {
                id: id
            },
            include: {
                model: Users,
                attributes: ['username']
            }
        });
    }
}