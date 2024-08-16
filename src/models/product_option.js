const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ProductOption extends Model {
    static associate(models) {
      // association with product model
      ProductOption.belongsTo(models.products, {
        foreignKey: 'product_id',
        as: 'product',
      });
    }
  }

  ProductOption.init(
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
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      shape: {
        type: DataTypes.ENUM('square', 'circle'),
        defaultValue: 'square',
      },
      radius: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      type: {
        type: DataTypes.ENUM('text', 'color'),
        defaultValue: 'text',
      }, 
      values: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'ProductOption',
      tableName: 'product_options',
      timestamps: true,
    }
  );

  return ProductOption;
}