var express = require('express');
var router = express.Router();
var articleRepo = require('../repositories/articles')

/* GET users listing. */
router.get('/getArticles', async function (req, res, next) {
    let page = parseInt(req.query.page)
    let articlesCount = await articleRepo.countArticles()
    let limit = parseInt(req.query.limit)
    if (limit <= 0 || isNaN(limit))
        req.query.limit = limit = 5
    const pagesNum = Math.ceil(articlesCount / limit)
    if (page <= 0 || isNaN(page) || page > pagesNum)
        req.query.page = page = 1
    const offset = (page - 1) * limit
    let articles = await articleRepo.getAllArticles(offset, limit)
    let data = {
        articlesArray: articles,
        limit: limit
    }
    res.render('component/articlesTable.html', data)
});

router.get('/getArticlesPagination', async function (req, res, next) {
    let page = parseInt(req.query.page)
    if (page <= 0 || isNaN(page))
        req.query.page = page = 1
    let limit = parseInt(req.query.limit)
    if (limit <= 0 || isNaN(limit))
        req.query.limit = limit = 5
    let articlesCount = await articleRepo.countArticles()
    let data = {
        page: page,
        limit: limit,
        pagesNum: Math.ceil(articlesCount / limit)
    }
    res.render('component/pagination.html', data)
});

router.post('/getByID', async function (req, res, next) {
    res.send(await articleRepo.getArticleById(req.body.id))
});

router.post('/count', async function (req, res, next) {
    res.send('' + await articleRepo.countArticles())
});


router.post('/add', async function (req, res, next) {
    let Article = {}
    Article.title = req.body.title
    Article.image = req.body.image
    Article.content = req.body.content
    Article.published = req.body.published
    Article.UserId = req.body.UserId
    let response = await articleRepo.addArticle(Article)
    let articlesCount = await articleRepo.countArticles()
    console.log(response)
    res.send(['Article has been added successfully', 'fas fa-check-circle', 'm-2 bg-success', , articlesCount])
});

router.put('/update', async function (req, res, next) {
    let Article = {}
    Article.id = req.body.id
    Article.title = req.body.title
    Article.image = req.body.image
    Article.content = req.body.content
    Article.published = req.body.published
    let articleIsModified = await articleRepo.updateArticle(Article)
    if (articleIsModified)
        res.send(['Modified article successfully', 'fas fa-check-circle', 'm-2 bg-success'])
    else
        res.send(['An error has occured', 'fas fa-exclamation-triangle', 'm-2 bg-warning'])
});

router.delete('/delete', async function (req, res, next) {
    let articleIsDeleted = await articleRepo.deleteArticle(req.body.id)
    let articlesCount = await articleRepo.countArticles()
    if (articleIsDeleted)
        res.send(['Removed article successfully', 'fas fa-check-circle', 'm-2 bg-danger', , articlesCount])
    else
        res.send(['An error has occured', 'fas fa-exclamation-triangle', 'm-2 bg-warning', , articlesCount])
});

router.get('/search/:searchtext', async function (req, res, next) {
    res.send(await articleRepo.searchForArticle(req.params.searchtext))
});

module.exports = router;
