let express = require('express')
let path = require('path')
let cookieParser = require('cookie-parser')
let logger = require('morgan')
let nunjucks = require('nunjucks')
let dateFilter = require('nunjucks-date-filter');
let fileUpload = require('express-fileupload');

let indexRouter = require('./routes/index')
let usersRouter = require('./routes/users')
let tagsRouter = require('./routes/tags')
let articlesRouter = require('./routes/articles')
let projectsRouter = require('./routes/projects')

let app = express()

// configute Nunjucks with 'views' as templates directory
let env = nunjucks.configure('views', {
    autoescape: true,
    express: app
})

env.addFilter('date', dateFilter);

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(fileUpload())

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/articles', articlesRouter)
app.use('/projects', projectsRouter)
app.use('/tags', tagsRouter)

module.exports = app