const { Projects } = require('../../models')
const { Users } = require('../../models')

module.exports = {
    async AllProjects() {
        return await Projects.findAll({
            include: {
                model: Users,
                attributes: ['username']
            }
        })
    },
    async getLastSixProjects() {
        return await Projects.findAll({
            order: [['createdAt', 'DESC']],
            limit: 6,
            include: {
                model: Users,
                attributes: ['username']
            }
        })
    },
    async getProjectById(id) {
        return await Projects.findOne({
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