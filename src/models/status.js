module.exports = (sequelize, DataTypes) => {
  const Status = sequelize.define('status', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    voteUp: {
      type: DataTypes.TEXT,
    },
    thanks: {
      type: DataTypes.TEXT,
    },
    voteDown: {
      type: DataTypes.TEXT,
    },
    favorite: {
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
  return Status;
};