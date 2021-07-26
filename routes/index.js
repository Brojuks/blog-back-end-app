var express = require('express');
var router = express.Router();
var userRepo = require('../repositories/user')
var tagRepo = require('../repositories/tags')
var projectRepo = require('../repositories/projects')
var articleRepo = require('../repositories/articles')
const { URLSearchParams } = require('url')

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

  let usersCount = await userRepo.countUsers()
  let limit = parseInt(req.query.limit)
  if (limit <= 0 || isNaN(limit))
    req.query.limit = limit = 5
  const pagesNum = Math.ceil(usersCount / limit)
  let page = parseInt(req.query.page)
  if (page <= 0 || isNaN(page) || page > pagesNum)
    req.query.page = page = 1
  const offset = (page - 1) * limit
  let users = await userRepo.getAllUsers(offset, limit)
  let data = {
    activePage: 'users',
    title: 'Users',
    usersArray: users,
    page: page,
    limit: limit,
    usersCount: usersCount,
    pagesNum: pagesNum
  }
  res.render('pages/users.html', data)
})

router.get('/articles', async function (req, res, next) {
  let limit = parseInt(req.query.limit)
  if (limit <= 0 || isNaN(limit))
    req.query.limit = limit = 5
  let articlesCount
  let searchtext = req.query.searchtext
  if (!searchtext || searchtext == 'null') {
    articlesCount = await articleRepo.countArticles()
  }
  else {
    articlesCount = await articleRepo.searchForArticle(searchtext)
    articlesCount = articlesCount.count
  }
  const pagesNum = Math.ceil(articlesCount / limit)
  let page = parseInt(req.query.page)
  if (page <= 0 || isNaN(page) || page > pagesNum)
    req.query.page = page = 1
  const offset = (page - 1) * limit
  let articles
  if (!searchtext || searchtext == 'null') {
    articles = await articleRepo.getAllArticles(offset, limit)
  }
  else {
    articles = await articleRepo.searchForArticle(searchtext, offset, limit)
    articles = articles.rows
  }
  let data = {
    activePage: 'articles',
    title: 'Articles',
    articlesArray: articles,
    page: page,
    limit: limit,
    articlesCount: articlesCount,
    pagesNum: pagesNum,
    searchtext: searchtext
  }
  res.render('pages/articles.html', data)
})

router.get('/projects', async function (req, res, next) {
  let limit = parseInt(req.query.limit)
  if (limit <= 0 || isNaN(limit))
    req.query.limit = limit = 5
  let projectsCount
  let searchtext = req.query.searchtext
  if (!searchtext || searchtext == 'null') {
    projectsCount = await projectRepo.countProjects()
  }
  else {
    projectsCount = await projectRepo.searchForProject(searchtext)
    projectsCount = projectsCount.count
  }
  const pagesNum = Math.ceil(projectsCount / limit)
  let page = parseInt(req.query.page)
  if (page <= 0 || isNaN(page) || page > pagesNum)
    req.query.page = page = 1
  const offset = (page - 1) * limit
  let projects
  if (!searchtext || searchtext == 'null') {
    projects = await projectRepo.getAllProjects(offset, limit)
  }
  else {
    projects = await projectRepo.searchForProject(searchtext, offset, limit)
    projects = projects.rows
  }
  let data = {
    activePage: 'projects',
    title: 'Projects',
    projectsArray: projects,
    page: page,
    limit: limit,
    projectsCount: projectsCount,
    pagesNum: pagesNum,
    searchtext: searchtext
  }
  res.render('pages/projects.html', data)
})
module.exports = router;
