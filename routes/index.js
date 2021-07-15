var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
  let data = {
    title: 'Admin Panel'
  }

  res.render('index.html', data)
})
router.get('/users', async function (req, res, next) {
  let data = {
    title: 'Users',
    data_variable: require('../views/component/variables.json')
  }

  res.render('pages/users.html', data)
})

module.exports = router;
