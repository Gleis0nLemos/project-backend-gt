const { Model, Datatypes } = require('sequelize');

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
        type: Datatypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      product_id: {
        type: Datatypes.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id',
        },
      },
      enabled: {
        type: Datatypes.BOOLEAN,
        defaultValue: false,
      },
      path: {
        type: Datatypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'ProductImage',
      tableName: 'product_images',
      timestamps: true,
    }
  )
}