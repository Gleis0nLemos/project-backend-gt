const { Product, Category, ProductCategory, ProductOption, ProductImage } = require('../models');
const { Op } = require('sequelize');

const getProducts = async (req, res) => {
  try {
    const {
      limit = 12,
      page = 1,
      fields,
      match,
      category_ids,
      'price-range': priceRange,
      option = {},
    } = req.body;

    const offset = (page - 1) * limit;

    const whereClause = {};

    // filter name or description
    if (match) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${match}%` } },
        { description: { [Op.like]: `%${match}%` } },
      ];
    }

    // filter by category
    if (category_ids) {
      whereClause.category_ids = { [Op.overlap]: category_ids.split(',').map(Number) };
    }

    // filter by price range
    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split('-').map(Number);
      whereClause.price = { [Op.between]: [minPrice, maxPrice] };
    }

    // filter by options
    for (const [optionId, values] of Object.entries(option)) {
      whereClause[`options.id`] = optionId;
      whereClause[`options.value`] = { [Op.in]: values.split(',') };
    }

    const products = await Product.findAndCountAll({
      where: whereClause,
      limit: limit === -1 ? undefined : parseInt(limit, 10),
      offset: limit === -1 ? undefined : offset,
      attributes: fields ? fields.split(',') : undefined,
      include: [
        {
          model: Category,
          as: 'categories',
          through: {
            attributes: ['category_id'],
          },
        },
        {
          model: ProductOption,
          as: 'options',
          attributes: ['id', 'values'], //'name', 
        },
        {
          model: ProductImage,
          as: 'images',
          attributes: ['id', 'path'],
        },
      ],
    });

    return res.status(200).json({
      data: products.rows,
      total: products.count,
      limit: parseInt(limit, 10),
      page: parseInt(page, 10),
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Bad request' });
  }
};

module.exports = {
  getProducts,
}