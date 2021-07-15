const { Users } = require('../models')
const { Op } = require("sequelize");

module.exports = {
    async countUsers() {
        return await Users.count()
    },
    async getAllUsers(offset = 0, limit = 10) {
        return await Users.findAll({
            attributes: { exclude: ['password'] },
            offset: offset,
            limit: limit,
        })
    },
    async addUser(userData) {
        return await Users.findOrCreate({
            username: userData.username,
            email: userData.email,
            password: userData.password,
        },
            {
                where: {
                    id: articleData.id
                },
            }
        )
    },
    async updateUser(userData) {
        return await Users.update({
            username: userData.username,
            email: userData.email,
            password: userData.password,
            where: {
                id: userData.id
            }
        })
    },
    async deleteUser(id) {
        return await Users.destroy({
            where: {
                id: id
            }
        })
    },
    async searchForUser(searchText) {
        return await Users.findAndCountAll({
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