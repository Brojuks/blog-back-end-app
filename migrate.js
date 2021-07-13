//simply execute this file by 'node run migrate' as the shortcut's been already added to package.json
const db = require('./models');
async function migrate() {
    await db.sequelize.sync({ force: true }); // so that the junction tables 'ArticlesTags' and 'ProjectsTags' can be created 
    console.log('Migrating tables process is now finished.')
}
migrate();