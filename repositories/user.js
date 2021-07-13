const { User } = require('../models')
const { Op } = require("sequelize");

module.exports = {
    async countUsers() {
        return await User.count()
    },
    async getAllUsers(offset = 0, limit = 10) {
        return await User.findAll({
            attributes: { exclude: ['password'] },
            offset: offset,
            limit: limit,
        })
    },
    async addUser(userData) {
        return await User.findOrCreate({
            username: userData.username,
            email: userData.email,
            password: userData.password,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt
        },
            {
                where: {
                    id: articleData.id
                },
            }
        )
    },
    async updateUser(userData) {
        return await User.update({
            username: userData.username,
            email: userData.email,
            password: userData.password,
            updatedAt: userData.updatedAt,
            where: {
                id: userData.id
            }
        })
    },
    async deleteUser(id) {
        return await User.destroy({
            where: {
                id: id
            }
        })
    },
    async searchForUser(searchText) {
        return await User.findAndCountAll({
            attributes: { exclude: ['password'] },
            where: {
                [Op.or]: [
                    { username: { [Op.substring]: searchText } },
                    { email: { [Op.substring]: searchText } }
                ],
            }
        })
    }
}