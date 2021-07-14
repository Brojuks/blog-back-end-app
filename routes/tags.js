var express = require('express');
var router = express.Router();
var tagRepo = require('../repositories/tags')

/* GET users listing. */
router.post('/', async function (req, res, next) {
    res.send(await tagRepo.getAllTags())
});

router.post('/count', async function (req, res, next) {
    res.send('' + await tagRepo.countTags())
});

router.post('/add', async function (req, res, next) {
    let Tag = {}
    Tag.tag = req.body.tag
    Tag.UserId = req.body.UserId
    res.send(await tagRepo.addTag(Tag))
});

router.put('/update', async function (req, res, next) {
    let Tag = {}
    Tag.id = req.body.id
    Tag.tag = req.body.tag
    Tag.UserId = req.body.UserId
    res.send(await tagRepo.updateTag(Tag))
});

router.delete('/delete', async function (req, res, next) {
    res.send('Successfully deleted tag with ID ' + req.body.id + '.\nStatus :' + await tagRepo.deleteTag(req.body.id))
});

router.get('/search/:searchtext', async function (req, res, next) {
    res.send(await tagRepo.searchForTag(req.params.searchtext))
});

module.exports = router;
