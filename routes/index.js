var express = require('express');
var router = express.Router();
var userRepo = require('../repositories/user')
var tagRepo = require('../repositories/tags')
var projectRepo = require('../repositories/projects')
var articleRepo = require('../repositories/articles')

/* GET home page. */
router.get('/', async function (req, res, next) {
  let usersCount = await userRepo.countUsers()
  let tagsCount = await tagRepo.countTags()
  let articlesCount = await articleRepo.countArticles()
  let projectsCount = await projectRepo.countProjects()
  let data = {
    activePage: 'home',
    title: 'Admin Panel',
    usersNum: usersCount,
    tagsNum: tagsCount,
    articlesNum: articlesCount,
    projectsNum: projectsCount
  }

  res.render('index.html', data)
})
router.get('/users', async function (req, res, next) {
  let users = await userRepo.getAllUsers()
  let data = {
    activePage: 'users',
    title: 'Users',
    usersArray: users
  }

  res.render('pages/users.html', data)
})
module.exports = router;
