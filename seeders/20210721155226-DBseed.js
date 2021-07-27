'use strict';
const faker = require('faker');
const { Articles, Projects, Tags, Users, Sequelize } = require('../models');

const users = [...Array(50)].map((user) => (
  {
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: faker.internet.password(8),
    createdAt: faker.date.between('2000-01-01', '2021-12-31'),
    updatedAt: new Date()
  }
))

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('users', users, {});
    console.log('Users seeding DONE');

    const usersIds = await Users.findAll({
      attributes: ['id']
    });

    await queryInterface.bulkInsert('articles',
      [...Array(50)].map((article) => (
        {
          title: faker.lorem.sentence(3, 3),
          image: 'upload/articles/default_Article.png',
          content: faker.lorem.paragraphs(2),
          published: faker.datatype.number({ min: 0, max: 1 }),
          UserId: faker.random.arrayElement(JSON.parse(JSON.stringify(usersIds))).id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ))
      , {});
    console.log('Articles seeding DONE');

    const articlesIds = await Articles.findAll({
      attributes: ['id']
    });

    await queryInterface.bulkInsert('projects',
      [...Array(50)].map((project) => (
        {
          title: faker.lorem.sentence(3, 3),
          image: 'upload/projects/default_Project.png',
          content: faker.lorem.paragraphs(2),
          published: faker.datatype.number({ min: 0, max: 1 }),
          UserId: faker.random.arrayElement(JSON.parse(JSON.stringify(usersIds))).id,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ))
      , {});
    console.log('Projects seeding DONE');

    const projectsIds = await Projects.findAll({
      attributes: ['id']
    });

    await queryInterface.bulkInsert('tags',
      [...Array(8)].map((tag) => (
        {
          tag: faker.lorem.sentence(3, 3),
          UserId: faker.random.arrayElement(JSON.parse(JSON.stringify(usersIds))).id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ))
      , {});
    console.log('Tags seeding DONE');

    const tagsIds = await Tags.findAll({
      attributes: ['id']
    });


    var art_last = JSON.parse(JSON.stringify(articlesIds)).length - 1
    var tag_last = JSON.parse(JSON.stringify(tagsIds)).length - 1
    var prjct_last = JSON.parse(JSON.stringify(projectsIds)).length - 1

    console.log('Adding ArticlesTags... (This may take a while)');
    for (let i = 0; i <= art_last; i++) {
      for (let j = 0; j <= faker.datatype.number({ min: 0, max: tag_last }); j++) {
        await queryInterface.bulkInsert('articlestags', [{
          ArticleId: JSON.parse(JSON.stringify(articlesIds))[i].id,
          TagId: JSON.parse(JSON.stringify(tagsIds))[j].id,
          createdAt: new Date(),
          updatedAt: new Date()
        }], {})
      }
    };
    console.log('ArticlesTags DONE');

    console.log('Adding ProjectsTags... (This may take a while)');
    for (let i = 0; i <= prjct_last; i++) {
      for (let j = 0; j <= faker.datatype.number({ min: 0, max: tag_last }); j++) {
        await queryInterface.bulkInsert('projectstags', [{
          ProjectId: JSON.parse(JSON.stringify(projectsIds))[i].id,
          TagId: JSON.parse(JSON.stringify(tagsIds))[j].id,
          createdAt: new Date(),
          updatedAt: new Date()
        }], {})
      }
    };
    console.log('ProjectsTags DONE');
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
