module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.CHAR,
    },
    pwd: {
      type: DataTypes.CHAR,
    },
    email: {
      type: DataTypes.CHAR,
    },
    avatarUrl: {
      type: DataTypes.TEXT,
    },
    headline: {
      type: DataTypes.CHAR,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  });
  // User.associate = (models) => {
  //   User.belongsTo(models.Article);
  // }
  return User;
};