const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ProductCategory extends Model {
    static associate(models) {
      // associations with product and category
      // ProductCategory.belongsTo(models.Product, {
      //   foreignKey: 'product_id',
      //   as: 'product',
      // });

      // ProductCategory.belongsTo(models.Category, {
      //   foreignKey: 'category_id',
      //   as: 'category',
      // })
    }
  }

  ProductCategory.init(
    {
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: 'ProductCategory',
      tableName: 'product_categories',
      timestamps: false,
    }
  );

  return ProductCategory;
}