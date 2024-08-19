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

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          as: 'categories',
          attributes: ['id'],  // Ajuste os atributos conforme necessário
        },
        {
          model: ProductOption,
          as: 'options',
          attributes: ['id', 'values'],  // Ajuste os atributos conforme necessário
        },
        {
          model: ProductImage,
          as: 'images',
          attributes: ['id', 'path'],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({
      id: product.id,
      enabled: product.enabled,
      name: product.name,
      slug: product.slug,
      stock: product.stock,
      description: product.description,
      price: product.price,
      price_with_discount: product.price_with_discount,
      //category_ids: product.category_ids,
      images: product.Images.map(image => ({
        id: image.id,
        content: image.content,
      })),
      options: product.Options.map(options => ({
        id: options.id,
        // Include other option fields as needed
      })),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const createProduct = async (req, res) => {
  try {
    // Validar o corpo da solicitação
    const { enabled, name, slug, stock, description, price, price_with_discount, category_ids, images, options } = req.body;

    if (!name || !slug || !price || !price_with_discount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Criar o produto
    const product = await Product.create({
      enabled,
      name,
      slug,
      stock,
      description,
      price,
      price_with_discount,
    });

    // Associar categorias
    if (category_ids && Array.isArray(category_ids)) {
      await product.setCategories(category_ids);
    }

    // Adicionar imagens
    if (images && Array.isArray(images)) {
      const imagePromises = images.map(image => ProductImage.create({
        type: image.type,
        path: image.content, // Assume que o conteúdo é base64
        product_id: product.id
      }));
      await Promise.all(imagePromises);
    }

    // Adicionar opções
    if (options && Array.isArray(options)) {
      const optionPromises = options.map(option => ProductOption.create({
        title: option.title,
        shape: option.shape,
        radius: option.radius,
        type: option.type,
        values: option.values.join(','),
        product_id: product.id
      }));
      await Promise.all(optionPromises);
    }

    return res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Função para atualizar um produto existente
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { enabled, name, slug, stock, description, price, price_with_discount, category_ids, images, options } = req.body;

    // Verificar se o produto existe
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Atualizar o produto
    await product.update({
      enabled,
      name,
      slug,
      stock,
      description,
      price,
      price_with_discount,
    });

    // Atualizar categorias
    if (category_ids && Array.isArray(category_ids)) {
      await product.setCategories(category_ids);
    }

    // Atualizar imagens
    if (images && Array.isArray(images)) {
      const existingImages = await ProductImage.findAll({ where: { product_id: productId } });
      const existingImageIds = existingImages.map(img => img.id);

      // Marcar imagens existentes para exclusão
      const imagesToDelete = existingImageIds.filter(id => !images.find(img => img.id === id));
      if (imagesToDelete.length > 0) {
        await ProductImage.destroy({ where: { id: imagesToDelete } });
      }

      // Atualizar ou adicionar novas imagens
      const imagePromises = images.map(async (image) => {
        if (image.deleted) {
          return ProductImage.destroy({ where: { id: image.id } });
        } else if (image.id) {
          return ProductImage.update(
            { type: image.type, path: image.content },
            { where: { id: image.id } }
          );
        } else {
          return ProductImage.create({
            type: image.type,
            path: image.content,
            product_id: productId
          });
        }
      });
      await Promise.all(imagePromises);
    }

    // Atualizar opções
    if (options && Array.isArray(options)) {
      const existingOptions = await ProductOption.findAll({ where: { product_id: productId } });
      const existingOptionIds = existingOptions.map(opt => opt.id);

      // Marcar opções existentes para exclusão
      const optionsToDelete = existingOptionIds.filter(id => !options.find(opt => opt.id === id));
      if (optionsToDelete.length > 0) {
        await ProductOption.destroy({ where: { id: optionsToDelete } });
      }

      // Atualizar ou adicionar novas opções
      const optionPromises = options.map(async (option) => {
        if (option.deleted) {
          return ProductOption.destroy({ where: { id: option.id } });
        } else if (option.id) {
          return ProductOption.update(
            { title: option.title, shape: option.shape, radius: option.radius, type: option.type, values: option.values.join(',') },
            { where: { id: option.id } }
          );
        } else {
          return ProductOption.create({
            title: option.title,
            shape: option.shape,
            radius: option.radius,
            type: option.type,
            values: option.values.join(','),
            product_id: productId
          });
        }
      });
      await Promise.all(optionPromises);
    }

    return res.status(204).send(); // 204 No Content
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Função para deletar um produto
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Verificar se o produto existe
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Remover o produto
    await product.destroy();

    return res.status(204).send(); // 204 No Content
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
}