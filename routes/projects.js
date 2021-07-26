var express = require('express');
var router = express.Router();
var projectRepo = require('../repositories/projects')

/* GET users listing. */
router.get('/getProjects', async function (req, res, next) {
    let page = parseInt(req.query.page)
    let projectsCount = await projectRepo.countProjects()
    let limit = parseInt(req.query.limit)
    if (limit <= 0 || isNaN(limit))
        req.query.limit = limit = 5
    const pagesNum = Math.ceil(projectsCount / limit)
    if (page <= 0 || isNaN(page) || page > pagesNum)
        req.query.page = page = 1
    const offset = (page - 1) * limit
    let projects = await projectRepo.getAllProjects(offset, limit)
    let data = {
        projectsArray: projects,
        limit: limit
    }
    res.render('component/projectsTable.html', data)
});

router.get('/getProjectsPagination', async function (req, res, next) {
    let page = parseInt(req.query.page)
    if (page <= 0 || isNaN(page))
        req.query.page = page = 1
    let limit = parseInt(req.query.limit)
    if (limit <= 0 || isNaN(limit))
        req.query.limit = limit = 5
    let projectsCount = await projectRepo.countProjects()
    let data = {
        page: page,
        limit: limit,
        pagesNum: Math.ceil(projectsCount / limit)
    }
    res.render('component/pagination.html', data)
});

router.post('/getByID', async function (req, res, next) {
    res.send(await projectRepo.getProjectById(req.body.id))
});

router.post('/count', async function (req, res, next) {
    res.send('' + await projectRepo.countProjects())
});

router.post('/add', async function (req, res, next) {
    let Project = {}
    Project.title = req.body.title
    Project.image = req.body.image
    Project.content = req.body.content
    Project.published = req.body.published
    Project.UserId = req.body.UserId
    await projectRepo.addProject(Project)
    let projectsCount = await projectRepo.countProjects()
    res.send(['Project has been added successfully', 'fas fa-check-circle', 'm-2 bg-success', , projectsCount])
});

router.put('/update', async function (req, res, next) {
    let Project = {}
    Project.id = req.body.id
    Project.title = req.body.title
    Project.image = req.body.image
    Project.content = req.body.content
    Project.published = req.body.published
    let projectIsModified = await projectRepo.updateProject(Project)
    if (projectIsModified)
        res.send(['Modified project #' + Project.id + ' successfully', 'fas fa-check-circle', 'm-2 bg-success'])
    else
        res.send(['An error has occured', 'fas fa-exclamation-triangle', 'm-2 bg-warning'])
});

router.delete('/delete', async function (req, res, next) {
    let projectIsDeleted = await projectRepo.deleteProject(req.body.id)
    let projectsCount = await projectRepo.countProjects()
    if (projectIsDeleted)
        res.send(['Removed project #' + req.body.id + ' successfully', 'fas fa-check-circle', 'm-2 bg-danger', , projectsCount])
    else
        res.send(['An error has occured', 'fas fa-exclamation-triangle', 'm-2 bg-warning', , projectsCount])
});

router.get('/search/:searchtext', async function (req, res, next) {
    res.send(await projectRepo.searchForProject(req.params.searchtext))
});

module.exports = router;
