var express = require('express');
var router = express.Router();
var projectRepo = require('../repositories/projects')
var moment = require('moment')

/* GET users listing. */
router.post('/', async function (err, req, res, next) {
    res.send(await projectRepo.getAllProjects())
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
    Project.createdAt = moment().format('YYYY/MM/DD hh:mm:ss')
    Project.updatedAt = moment().format('YYYY/MM/DD hh:mm:ss')
    res.send(await projectRepo.addProject(Project))
});

router.put('/update', async function (req, res, next) {
    let Project = {}
    Project.id = req.body.id
    Project.title = req.body.title
    Project.image = req.body.image
    Project.content = req.body.content
    Project.published = req.body.published
    Project.updatedAt = moment().format('YYYY/MM/DD hh:mm:ss')
    res.send(await projectRepo.updateProject(Project))
});

router.delete('/delete', async function (req, res, next) {
    res.send('Successfully deleted project with ID ' + req.body.id + '.\nStatus :' + await projectRepo.deleteProject(req.body.id))
});

router.get('/search/:searchtext', async function (req, res, next) {
    res.send(await projectRepo.searchForProject(req.params.searchtext))
});

module.exports = router;
