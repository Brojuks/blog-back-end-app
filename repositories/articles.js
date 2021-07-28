const { Articles } = require('../models')
const { Users } = require('../models')
const { Op } = require("sequelize");

module.exports = {
    async countArticles() {
        return await Articles.count()
    },

    //For pagination with offset meannig to skip instances/rows, and limit meaning to Fetch limited instances/rows(10 for example)
    async getAllArticles(offset = 0, limit = 10) {
        return await Articles.findAll({
            offset: offset,
            limit: limit,
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
    },

    async searchForArticle(searchText, offset = 0, limit = 10) {
        return await Articles.findAndCountAll({
            offset: offset,
            limit: limit,
            where: {
                [Op.or]: [
                    { title: { [Op.substring]: searchText } },
                    { content: { [Op.substring]: searchText } }
                ],
            }
        })
    },

    async addArticle(articleData) {
        return await Articles.create({
            title: articleData.title,
            image: articleData.image,
            content: articleData.content,
            published: articleData.published,
            UserId: articleData.UserId,
        })
    },

    async updateArticle(articleData) {
        return await Articles.update({
            title: articleData.title,
            image: articleData.image,
            content: articleData.content,
            published: articleData.published,
        },
            {
                where: {
                    id: articleData.id
                },
            }
        )
    },

    async deleteArticle(id) {
        return await Articles.destroy({
            where: {
                id: id
            }
        })
    }
}