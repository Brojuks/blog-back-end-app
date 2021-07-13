'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tags extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tags.belongsTo(models.User)
      Tags.belongsToMany(models.Articles, { through: 'ArticlesTags' })
      Tags.belongsToMany(models.Projects, { through: 'ProjectsTags' })
    }
  };
  Tags.init({
    tag: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [2, 15]
      }
    },
  }, {
    sequelize,
    modelName: 'Tags',
  });
  return Tags;
};