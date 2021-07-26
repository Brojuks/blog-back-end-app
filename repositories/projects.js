const { Projects } = require('../models')
const { Users } = require('../models')
const { Op } = require("sequelize");

module.exports = {
    async countProjects() {
        return await Projects.count()
    },

    //For pagination with offset meannig to skip instances/rows, and limit meaning to Fetch limited instances/rows(10 for example)
    async getAllProjects(offset = 0, limit = 10) {
        return await Projects.findAll({
            offset: offset,
            limit: limit,
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
            }
        });
    },

    async searchForProject(searchText) {
        return await Projects.findAndCountAll({
            where: {
                [Op.or]: [
                    { title: { [Op.substring]: searchText } },
                    { content: { [Op.substring]: searchText } }
                ],
            }
        })
    },

    async addProject(projectData) {
        return await Projects.create({
            title: projectData.title,
            image: projectData.image,
            content: projectData.content,
            published: projectData.published,
            UserId: projectData.UserId,
        })
    },

    async updateProject(projectData) {
        return await Projects.update({
            title: projectData.title,
            image: projectData.image,
            content: projectData.content,
            published: projectData.published,
        },
            {
                where: {
                    id: projectData.id
                },
            }
        )
    },

    async deleteProject(id) {
        return await Projects.destroy({
            where: {
                id: id
            }
        })
    }
}