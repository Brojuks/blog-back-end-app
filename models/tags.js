'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tag.belongsTo(models.Users)
      Tag.belongsToMany(models.Articles, { through: 'ArticlesTags' })
      Tag.belongsToMany(models.Projects, { through: 'ProjectsTags' })
    }
  };
  Tag.init({
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
  return Tag;
};