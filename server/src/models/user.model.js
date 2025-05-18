module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        len: [2, 60]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(400),
      allowNull: true,
      validate: {
        len: [0, 400]
      }
    },
    role: {
      type: DataTypes.ENUM('admin', 'user', 'store_owner'),
      defaultValue: 'user'
    }
  }, {
    timestamps: true,
    tableName: 'users'
  });

  User.associate = (models) => {
    // A User can have many Ratings
    User.hasMany(models.Rating, {
      foreignKey: 'userId',
      as: 'ratings'
    });

    // A User (store_owner) can own a Store
    User.hasOne(models.Store, {
      foreignKey: 'ownerId',
      as: 'ownedStore'
    });
  };

  return User;
}; 