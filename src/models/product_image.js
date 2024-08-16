const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ProductImage extends Model {
    static associate(models) {
      // association with product model
      ProductImage.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product',
      });
    }
  }

  ProductImage.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id',
        },
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'ProductImage',
      tableName: 'product_images',
      timestamps: true,
    }
  );

  return ProductImage;
}