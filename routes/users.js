var express = require('express');
var router = express.Router();
var userRepo = require('../repositories/user')

/* GET users listing. */
router.get('/getUsers', async function (req, res, next) {
  let page = parseInt(req.query.page)
  let usersCount = await userRepo.countUsers()
  let limit = parseInt(req.query.limit)
  if (limit <= 0 || isNaN(limit))
    req.query.limit = limit = 5
  const pagesNum = Math.ceil(usersCount / limit)
  if (page <= 0 || isNaN(page) || page > pagesNum)
    req.query.page = page = 1
  const offset = (page - 1) * limit
  let users = await userRepo.getAllUsers(offset, limit)
  let data = {
    usersArray: users,
    limit: limit
  }
  res.render('component/usersTable.html', data)
});

router.get('/getUsersPagination', async function (req, res, next) {
  let page = parseInt(req.query.page)
  if (page <= 0 || isNaN(page))
    req.query.page = page = 1
  let limit = parseInt(req.query.limit)
  if (limit <= 0 || isNaN(limit))
    req.query.limit = limit = 5
  let usersCount = await userRepo.countUsers()
  let data = {
    page: page,
    limit: limit,
    pagesNum: Math.ceil(usersCount / limit)
  }
  res.render('component/pagination.html', data)
});

router.post('/getByID', async function (req, res, next) {
  res.send(await userRepo.getUserById(req.body.id))
});
router.post('/checkUserDuplicate', async function (req, res, next) {
  let User = {}
  User.username = req.body.username
  User.email = req.body.email
  User.id = req.body.id
  let response = await userRepo.checkUserDuplicate(User)
  if (response === null) {
    res.send('');
  }
  else {
    res.send(['An error has occured', 'fas fa-exclamation-triangle', 'm-2 bg-warning', 'The email or username have already been used!']);
  }
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
  let usersCount = await userRepo.countUsers()
  if (response[1]) {
    res.send(['User has been added successfully', 'fas fa-check-circle', 'm-2 bg-success', , usersCount])
  } else {
    res.send(['An error has occured', 'fas fa-exclamation-triangle', 'm-2 bg-warning', 'The email or username have already been used!', usersCount])
  }
});

router.put('/update', async function (req, res, next) {
  let User = {}
  User.username = req.body.username
  User.email = req.body.email
  User.id = req.body.id
  let userIsModified = await userRepo.updateUser(User)
  if (userIsModified)
    res.send(['Modified user successfully', 'fas fa-check-circle', 'm-2 bg-success'])
  else
    res.send(['An error has occured', 'fas fa-exclamation-triangle', 'm-2 bg-warning', 'The email or username have already been used!'])
});

router.delete('/delete', async function (req, res, next) {
  let userIsDeleted = await userRepo.deleteUser(req.body.id)
  let usersCount = await userRepo.countUsers()
  if (userIsDeleted)
    res.send(['Removed user successfully', 'fas fa-check-circle', 'm-2 bg-danger', , usersCount])
  else
    res.send(['An error has occured', 'fas fa-exclamation-triangle', 'm-2 bg-warning', , usersCount])
});

router.get('/search/:searchtext', async function (req, res, next) {
  res.send(await userRepo.searchForUser(req.params.searchtext))
});

module.exports = router;
