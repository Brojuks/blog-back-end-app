const { Tags } = require('../models')
const { Op } = require("sequelize");

module.exports = {

    async countTags() {
        return await Tags.count()
    },
    async getAllTags(offset, limit) {
        return await Tags.findAll({
            offset: offset,
            limit: limit,
        })
    },
    async addTag(tagData) {
        return await Tags.findOrCreate({
            where: { tag: tagData.tag, },
            defaults: {
                tag: tagData.tag,
                createdAt: tagData.createdAt,
                updatedAt: tagData.updatedAt,
                UserId: tagData.UserId
            }
        })
    },
    async updateTag(tagData) {
        return await Tags.update({
            tag: tagData.tag,
            createdAt: tagData.createdAt,
            updatedAt: tagData.updatedAt,
            UserId: tagData.UserId,
            where: {
                id: tagData.id
            }
        })
    },
    async deleteTag(id) {
        return await Tags.destroy({
            where: {
                id: id
            }
        })
    },
    async searchForTag(searchText) {
        return await Tags.findAndCountAll({
            where: {
                tag: { [Op.substring]: searchText }
            }
        })
    }
}