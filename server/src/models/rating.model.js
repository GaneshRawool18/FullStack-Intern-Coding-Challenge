module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'stores',
        key: 'id'
      }
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    timestamps: true,
    tableName: 'ratings',
    indexes: [
      {
        unique: true,
        fields: ['userId', 'storeId']
      }
    ]
  });

  Rating.associate = (models) => {
    // A Rating belongs to a User
    Rating.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    // A Rating belongs to a Store
    Rating.belongsTo(models.Store, {
      foreignKey: 'storeId',
      as: 'store'
    });
  };

  return Rating;
}; 