const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Category extends Model {

    static associate(models) {
      // a category has many products
      // Category.hasMany(models.Product, {
      //   foreignKey: 'category_id',
      //   as: 'relatedProducts',
      // });

      // a category belongs to many categories
      Category.belongsToMany(models.Product, {
        through: models.ProductCategory,
        foreignKey: 'category_id',
        as: 'products',
      });
    }
  }

  Category.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      use_in_menu: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Category',
      tableName: 'categories',
      timestamps: true,
    }
  );

  return Category;
}