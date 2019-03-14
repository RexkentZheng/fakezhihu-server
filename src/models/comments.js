module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('comments', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    creatorId: {
      type: DataTypes.INTEGER,
    },
    content: {
      type: DataTypes.TEXT,
    },
    targetId: {
      type: DataTypes.INTEGER,
    },
    targetType: {
      type: DataTypes.INTEGER,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  });
  Comment.associate = (models) => {
    Comment.belongsTo(models.users, { foreignKey: 'creatorId', as: 'author' });
    Comment.hasOne(models.status, { foreignKey: 'targetId', as: 'status' });
    Comment.hasMany(models.comments, { foreignKey: 'targetId', as: 'comment' });
  }
  return Comment;
};