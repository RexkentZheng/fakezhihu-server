module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('articles', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.CHAR,
    },
    content: {
      type: DataTypes.TEXT,
    },
    excerpt: {
      type: DataTypes.CHAR,
    },
    creatorId: {
      type: DataTypes.INTEGER,
    },
    type: {
      type: DataTypes.INTEGER,
    },
    cover: {
      type: DataTypes.CHAR,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  });
  Article.associate = (models) => {
    Article.belongsTo(models.users, { foreignKey: 'creatorId', as: 'author' });
    Article.hasOne(models.status, { foreignKey: 'targetId', as: 'status' });
    Article.hasMany(models.comments, { foreignKey: 'targetId', as: 'comment' });
  }
  return Article;
};