var express = require('express');
var router = express.Router();
var apiArticleRepo = require('../../repositories/api/articles')


router.get('/', async function (req, res, next) {
    res.json(await apiArticleRepo.AllArticles())
});
router.get('/lastsix', async function (req, res, next) {
    res.json(await apiArticleRepo.getLastSixArticles())
});
router.get('/:id', async function (req, res, next) {
    res.json(await apiArticleRepo.getArticleById(req.params.id))
});

module.exports = router;