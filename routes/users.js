var express = require('express');
var router = express.Router();
var userRepo = require('../repositories/user')
var moment = require('moment')

/* GET users listing. */
router.post('/', async function (err, req, res, next) {
  res.send(await userRepo.getAllUsers())
});

router.post('/count', async function (req, res, next) {
  res.send('' + await userRepo.countUsers())
});

router.post('/add', async function (req, res, next) {
  let User = {}
  User.id = req.body.id
  User.username = req.body.username
  User.email = req.body.email
  User.password = req.body.password
  User.createdAt = moment().format('YYYY/MM/DD hh:mm:ss')
  User.updatedAt = moment().format('YYYY/MM/DD hh:mm:ss')
  res.send(await userRepo.addUser(User))
});

router.put('/update', async function (req, res, next) {
  let User = {}
  User.username = req.body.username
  User.email = req.body.email
  User.password = req.body.password
  User.updatedAt = moment().format('YYYY/MM/DD hh:mm:ss')
  res.send(await userRepo.updateUser(User))
});

router.delete('/delete', async function (req, res, next) {
  res.send('Successfully deleted user with ID ' + req.body.id + '.\nStatus :' + await userRepo.deleteUser(req.body.id))
});

router.get('/search/:searchtext', async function (req, res, next) {
  res.send(await userRepo.searchForUser(req.params.searchtext))
});

module.exports = router;
