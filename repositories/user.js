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

    async getUserById(id) {
        return await Users.findOne({
            attributes: { exclude: ['password'] },
            where: {
                id: id
            }
        });
    },
    async checkUserDuplicate(userData) {
        return await Users.findOne({
            attributes: { exclude: ['password'] },
            where: {
                id: {
                    [Op.ne]: userData.id
                },
                [Op.or]: [
                    { username: userData.username },
                    { email: userData.email }
                ]
            }
        });
    },

    async addUser(userData) {
        return await Users.findOrCreate({
            where: {
                [Op.or]: [
                    { username: userData.username },
                    { email: userData.email }
                ]
            },
            defaults: {
                username: userData.username,
                email: userData.email,
                password: userData.password,
            }
        });
    },
    async updateUser(userData) {
        return await Users.update({
            username: userData.username,
            email: userData.email,
        },
            {
                where: {
                    id: userData.id
                },
            }
        )
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