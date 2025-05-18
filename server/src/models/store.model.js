module.exports = (sequelize, DataTypes) => {
  const Store = sequelize.define('Store', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [2, 100]
      }
    },
    address: {
      type: DataTypes.STRING(400),
      allowNull: false,
      validate: {
        len: [5, 400]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    averageRating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5
      }
    },
    totalRatings: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    timestamps: true,
    tableName: 'stores'
  });

  Store.associate = (models) => {
    // A Store belongs to a User (owner)
    Store.belongsTo(models.User, {
      foreignKey: 'ownerId',
      as: 'owner'
    });

    // A Store has many Ratings
    Store.hasMany(models.Rating, {
      foreignKey: 'storeId',
      as: 'ratings'
    });
  };

  return Store;
}; 