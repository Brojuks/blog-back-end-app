var express = require('express');
var router = express.Router();
var apiProjectRepo = require('../../repositories/api/projects')

router.get('/', async function (req, res, next) {
    res.json(await apiProjectRepo.AllProjects())
});
router.get('/lastsix', async function (req, res, next) {
    res.json(await apiProjectRepo.getLastSixProjects())
});
router.get('/:id', async function (req, res, next) {
    res.json(await apiProjectRepo.getProjectById(req.params.id))
});

module.exports = router;