const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Product extends Model {

    static associate(models) {
      // a products belongs to a category
      // Product.belongsTo(models.Category, {
      //   foreignKey: 'category_id',
      //   as: 'category',
      // });

      // a product belongs to many categories
      Product.belongsToMany(models.Category, {
        through: models.ProductCategory,
        foreignKey: 'product_id',
        as: 'categories',
      });

      // a product has many options
      Product.hasMany(models.ProductOption, {
        foreignKey: 'product_id',
        as: 'options',
      })

      // a product has many images
      Product.hasMany(models.ProductImage, {
        foreignKey: 'product_id',
        as: 'images',
      });
    }
  }

  Product.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
      stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      price_with_discount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Product',
      tableName: 'products',
      timestamps: true,
    }
  );
  
  return Product;
}