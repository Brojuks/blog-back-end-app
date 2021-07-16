var express = require('express');
var router = express.Router();
var userRepo = require('../repositories/user')

/* GET users listing. */
router.post('/', async function (req, res, next) {
  res.send(await userRepo.getAllUsers())
});

router.post('/count', async function (req, res, next) {
  res.send('' + await userRepo.countUsers())
});

router.post('/add', async function (req, res, next) {
  let User = {}
  User.username = req.body.username
  User.email = req.body.email
  User.password = req.body.password
  let response = await userRepo.addUser(User)
  if (response[1]) {
    res.send(['User has been added successfully', 'fas fa-check-circle', 'm-2 bg-success'])
  } else {
    res.send(['An error has occured', 'fas fa-exclamation-triangle', 'm-2 bg-warning', 'The email or username have already been used!'])
  }
});

router.put('/update', async function (req, res, next) {
  let User = {}
  User.username = req.body.username
  User.email = req.body.email
  User.password = req.body.password
  let response = await userRepo.updateUser(User)
  res.send(response)
});

router.delete('/delete', async function (req, res, next) {
  let userIsDeleted = await userRepo.deleteUser(req.body.id)
  if (userIsDeleted)
    res.send(['Removed user successfully', 'fas fa-check-circle', 'm-2 bg-danger'])
  else
    res.send(['An error has occured', 'fas fa-exclamation-triangle', 'm-2 bg-warning'])
});

router.get('/search/:searchtext', async function (req, res, next) {
  res.send(await userRepo.searchForUser(req.params.searchtext))
});

module.exports = router;
