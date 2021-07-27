var express = require('express');
var router = express.Router();
var projectRepo = require('../repositories/projects')
const fs = require('fs');


/* REST API */
router.get('/all', async function (req, res, next) {
    res.json(await projectRepo.AllProjects())
});
router.get('/lastsix', async function (req, res, next) {
    res.json(await projectRepo.getLastSixProjects())
});
router.get('/:id', async function (req, res, next) {
    res.json(await projectRepo.getProjectById(req.params.id))
});
/* ./REST API */

/* GET users listing. */
router.get('/getProjects', async function (req, res, next) {
    let page = parseInt(req.query.page)
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
    let projectsCount
    let searchtext = req.query.searchtext
    if (!searchtext || searchtext == 'null') {
        projectsCount = await projectRepo.countProjects()
    }
    else {
        projectsCount = await projectRepo.searchForProject(searchtext)
        projectsCount = projectsCount.count
    }
    let data = {
        page: page,
        limit: limit,
        pagesNum: Math.ceil(projectsCount / limit),
        searchtext: searchtext
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
    let searchtext = req.query.searchtext
    let projectsCount
    if (!searchtext || searchtext == 'null') {
        projectsCount = await projectRepo.countProjects()
    }
    else {
        projectsCount = await projectRepo.searchForProject(searchtext)
        projectsCount = projectsCount.count
    }
    res.send(['Project has been added successfully', 'fas fa-check-circle', 'm-2 bg-success', , projectsCount])
});

router.put('/update', async function (req, res, next) {
    let Project = {}
    Project.id = req.body.id
    Project.title = req.body.title
    Project.image = req.body.imageEdit
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
    fs.unlink(req.body.image, (err) => {
        if (err) {
            console.log("failed to delete local image:" + err);
        } else {
            console.log('successfully deleted local image');
        }
    });
    let searchtext = req.query.searchtext
    let projectsCount
    if (!searchtext || searchtext == 'null') {
        projectsCount = await projectRepo.countProjects()
    }
    else {
        projectsCount = await projectRepo.searchForProject(searchtext)
        projectsCount = projectsCount.count
    }
    if (projectIsDeleted)
        res.send(['Removed project #' + req.body.id + ' successfully', 'fas fa-check-circle', 'm-2 bg-danger', , projectsCount])
    else
        res.send(['An error has occured', 'fas fa-exclamation-triangle', 'm-2 bg-warning', , projectsCount])
});

router.get('/search', async function (req, res, next) {
    let page = parseInt(req.query.page)
    let projectsCount = await projectRepo.searchForProject(req.query.searchtext)
    projectsCount = projectsCount.count
    let limit = parseInt(req.query.limit)
    if (limit <= 0 || isNaN(limit))
        req.query.limit = limit = 5
    const pagesNum = Math.ceil(projectsCount / limit)
    if (page <= 0 || isNaN(page) || page > pagesNum)
        req.query.page = page = 1
    const offset = (page - 1) * limit
    let projects = await projectRepo.searchForProject(req.query.searchtext, offset, limit)
    let data = {
        projectsArray: projects.rows,
        limit: limit
    }
    res.render('component/projectsTable.html', data)
});

router.post('/upload', async function (req, res) {
    let uploadPath
    let imageFile
    if (req.body.imageEdit) {
        fs.unlink(req.body.imageEdit, (err) => {
            if (err) {
                console.log("failed to delete local image:" + err);
            } else {
                console.log('successfully deleted local image');
            }
        });
    }
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send(['An error has occured', 'fas fa-exclamation-triangle', 'm-2 bg-warning', 'No files were uploaded.']);
    }
    imageFile = req.files.imgFile
    if (imageFile.mimetype !== ("image/png" || "image/jpeg"))
        return res.status(400).send(['An error has occured', 'fas fa-exclamation-triangle', 'm-2 bg-warning', 'Incorrect file type please choose either a png or a jpg file.'])
    imageFile.name = new Date().getTime() + "_Project" + imageFile.name.slice(-4)
    uploadPath = process.cwd() + '/public/upload/projects/' + imageFile.name;
    imageFile.mv(uploadPath, function (err) {
        if (err) {
            console.log(err)
            return res.status(500).send(['An error has occured', 'fas fa-exclamation-triangle', 'm-2 bg-warning', 'Internal Server Error']);
        }
        res.send(uploadPath)
    });
})

module.exports = router;
