const { Category } = require('../models');

const searchCategories = async (req, res) => {
  try {
    const { limit = 12, page = 1, fields, use_in_menu } = req.query;

    // default settings
    const queryOptions = {
      where: {},
      attributes: [],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    };

    // if limit is -1, remove limit and offset
    if (limit === '-1') {
      delete queryOptions.limit;
      delete queryOptions.offset;
    }

    // limit all fields retorned
    if (fields) {
      queryOptions.attributes = fields.split(',');
    } else {
      queryOptions.attributes = ['id', 'name', 'slug', 'use_in_menu'];
    }

    // filter by use_in_menu if provided
    if (use_in_menu) {
      queryOptions.where.use_in_menu = use_in_menu === 'true';
    }

    // search for categories
    const categories = await Category.findAll(queryOptions);

    // count total categories for pagination
    const total = await Category.count({ where: queryOptions.where });

    // format response
    res.status(200).json({
      data: categories,
      total,
      limit: parseInt(limit),
      page: parseInt(page),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    // search category by id
    const category = await Category.findByPk(id, {
      attributes: ['id', 'name', 'slug', 'use_in_menu'],
    });

    // if category not found, return 404
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // returns category data
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  searchCategories,
  getCategoryById,
};
