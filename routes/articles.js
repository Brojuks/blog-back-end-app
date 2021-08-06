var express = require('express');
var router = express.Router();
var articleRepo = require('../repositories/articles')
const fs = require('fs');


/* GET users listing. */
router.get('/getArticles', async function (req, res, next) {
    let page = parseInt(req.query.page)
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
    let articlesCount
    let searchtext = req.query.searchtext
    if (!searchtext || searchtext == 'null') {
        articlesCount = await articleRepo.countArticles()
    }
    else {
        articlesCount = await articleRepo.searchForArticle(searchtext)
        articlesCount = articlesCount.count
    }
    let data = {
        page: page,
        limit: limit,
        pagesNum: Math.ceil(articlesCount / limit),
        searchtext: searchtext
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
    await articleRepo.addArticle(Article)
    let articlesCount
    let searchtext = req.query.searchtext
    if (!searchtext || searchtext == 'null') {
        articlesCount = await articleRepo.countArticles()
    }
    else {
        articlesCount = await articleRepo.searchForArticle(searchtext)
        articlesCount = articlesCount.count
    }
    res.send(['Article has been added successfully', 'fas fa-check-circle', 'm-2 bg-success', , articlesCount])
});

router.put('/update', async function (req, res, next) {
    let Article = {}
    Article.id = req.body.id
    Article.title = req.body.title
    Article.image = req.body.imageEdit
    Article.content = req.body.content
    Article.published = req.body.published
    let articleIsModified = await articleRepo.updateArticle(Article)
    if (articleIsModified)
        res.send(['Modified article #' + Article.id + ' successfully', 'fas fa-check-circle', 'm-2 bg-success'])
    else
        res.send(['An error has occured', 'fas fa-exclamation-triangle', 'm-2 bg-warning'])
});

router.delete('/delete', async function (req, res, next) {
    let articleIsDeleted = await articleRepo.deleteArticle(req.body.id)
    if (req.body.image.split('articles')[1] !== "/default_Article.png") {
        fs.unlink(req.body.image, (err) => {
            if (err) {
                console.log("failed to delete local image:" + err);
            } else {
                console.log('successfully deleted local image');
            }
        })
    };
    let articlesCount
    let searchtext = req.query.searchtext
    if (!searchtext || searchtext == 'null') {
        articlesCount = await articleRepo.countArticles()
    }
    else {
        articlesCount = await articleRepo.searchForArticle(searchtext)
        articlesCount = articlesCount.count
    }
    if (articleIsDeleted)
        res.send(['Removed article #' + req.body.id + ' successfully', 'fas fa-check-circle', 'm-2 bg-danger', , articlesCount])
    else
        res.send(['An error has occured', 'fas fa-exclamation-triangle', 'm-2 bg-warning', , articlesCount])
});

router.get('/search', async function (req, res, next) {
    let page = parseInt(req.query.page)
    let articlesCount = await articleRepo.searchForArticle(req.query.searchtext)
    articlesCount = articlesCount.count
    let limit = parseInt(req.query.limit)
    if (limit <= 0 || isNaN(limit))
        req.query.limit = limit = 5
    const pagesNum = Math.ceil(articlesCount / limit)
    if (page <= 0 || isNaN(page) || page > pagesNum)
        req.query.page = page = 1
    const offset = (page - 1) * limit
    let articles = await articleRepo.searchForArticle(req.query.searchtext, offset, limit)
    let data = {
        projectsArray: articles.rows,
        limit: limit
    }
    res.render('component/projectsTable.html', data)
});

router.post('/upload', async function (req, res) {
    let uploadPath
    let imageFile
    if (req.body.imageEdit && req.body.imageEdit.split('articles')[1] !== "/default_Article.png") {
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
    imageFile.name = new Date().getTime() + "_Article" + imageFile.name.slice(-4)
    uploadPath = process.cwd() + '/public/upload/articles/' + imageFile.name;
    imageFile.mv(uploadPath, function (err) {
        if (err) {
            console.log(err)
            return res.status(500).send(['An error has occured', 'fas fa-exclamation-triangle', 'm-2 bg-warning', 'Internal Server Error']);
        }
        res.send(uploadPath)
    });
})

module.exports = router;
