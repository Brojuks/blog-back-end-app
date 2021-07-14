var express = require('express');
var router = express.Router();
var articleRepo = require('../repositories/articles')

/* GET users listing. */
router.post('/', async function (req, res, next) {
    res.send(await articleRepo.getAllArticles())
});

router.post('/count', async function (req, res, next) {
    res.send('' + await articleRepo.countArticles())
});

router.post('/add/:title/:image/:content/:published/:UserId', async function (req, res, next) {
    let Article = {}
    Article.title = req.params.title
    Article.image = req.params.image
    Article.content = req.params.content
    Article.published = req.params.published
    Article.UserId = req.params.UserId
    res.send(await articleRepo.addArticle(Article))
});

router.put('/update/:title/:image/:content/:published/:id', async function (req, res, next) {
    let Article = {}
    Article.id = req.params.id
    Article.title = req.params.title
    Article.image = req.params.image
    Article.content = req.params.content
    Article.published = req.params.published
    res.send(await articleRepo.updateArticle(Article))
});

router.delete('/delete/:id', async function (req, res, next) {
    res.send('Successfully deleted article with ID ' + req.params.id + '.\nStatus :' + await articleRepo.deleteArticle(req.params.id))
});

router.get('/search/:searchtext', async function (req, res, next) {
    res.send(await articleRepo.searchForArticle(req.params.searchtext))
});

module.exports = router;
