const Product = require('../models/Product');

// @desc    Fetch all products with filtering, search, sorting & pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 12;
    const page = Number(req.query.page) || 1;

    // Search query
    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: 'i' } },
            { description: { $regex: req.query.keyword, $options: 'i' } },
            { brand: { $regex: req.query.keyword, $options: 'i' } },
            { category: { $regex: req.query.keyword, $options: 'i' } },
            { tags: { $regex: req.query.keyword, $options: 'i' } },
          ],
        }
      : {};

    // Filter by category
    const category = req.query.category && req.query.category !== 'all'
      ? { category: { $regex: new RegExp(`^${req.query.category}$`, 'i') } }
      : {};

    // Filter by brand
    const brand = req.query.brand && req.query.brand !== 'all'
      ? { brand: { $regex: new RegExp(`^${req.query.brand}$`, 'i') } }
      : {};

    // Filter by price range
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : 0;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : 10000000;
    const priceFilter = { price: { $gte: minPrice, $lte: maxPrice } };

    // Filter by rating
    const ratingFilter = req.query.rating ? { rating: { $gte: Number(req.query.rating) } } : {};

    // Filter by in-stock
    const stockFilter = req.query.inStock === 'true' ? { stock: { $gt: 0 } } : {};

    // Filter by eco choice
    const ecoFilter = req.query.isEcoChoice === 'true' ? { isEcoChoice: true } : {};

    const query = {
      ...keyword,
      ...category,
      ...brand,
      ...priceFilter,
      ...ratingFilter,
      ...stockFilter,
      ...ecoFilter,
    };

    // Sorting
    let sortOption = { createdAt: -1 };
    if (req.query.sort === 'price-asc') sortOption = { price: 1 };
    else if (req.query.sort === 'price-desc') sortOption = { price: -1 };
    else if (req.query.sort === 'rating') sortOption = { rating: -1 };
    else if (req.query.sort === 'popular') sortOption = { numReviews: -1 };
    else if (req.query.sort === 'discount') sortOption = { discountPrice: -1 };

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      success: true,
      products,
      page,
      pages: Math.ceil(count / pageSize),
      totalProducts: count,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Fetch single product by ID or slug
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const isObjectId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    let product;

    if (isObjectId) {
      product = await Product.findById(req.params.id).populate('seller', 'name email avatar');
    } else {
      product = await Product.findOne({ slug: req.params.id }).populate('seller', 'name email avatar');
    }

    if (product) {
      // Find related products in same category
      const relatedProducts = await Product.find({
        category: product.category,
        _id: { $ne: product._id },
      }).limit(4);

      res.json({ success: true, product, relatedProducts });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get featured & best-seller products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const featured = await Product.find({ isFeatured: true }).limit(8);
    const bestSellers = await Product.find({ isBestSeller: true }).limit(8);
    const deals = await Product.find({ discountPrice: { $gt: 0 } }).limit(8);
    const ecoFriendly = await Product.find({ isEcoChoice: true }).limit(8);

    res.json({
      success: true,
      featured,
      bestSellers,
      deals,
      ecoFriendly,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a product (Seller/Admin)
// @route   POST /api/products
// @access  Private/Seller/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      discountPrice,
      description,
      shortDescription,
      images,
      category,
      brand,
      stock,
      specifications,
      tags,
      isFeatured,
      isBestSeller,
      isEcoChoice,
    } = req.body;

    const product = new Product({
      name,
      price,
      discountPrice: discountPrice || 0,
      description,
      shortDescription: shortDescription || '',
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'],
      category,
      brand: brand || 'EcoCommerce',
      stock: stock !== undefined ? Number(stock) : 10,
      specifications: specifications || [],
      tags: tags || [],
      isFeatured: Boolean(isFeatured),
      isBestSeller: Boolean(isBestSeller),
      isEcoChoice: Boolean(isEcoChoice),
      seller: req.user._id,
      rating: 5,
      numReviews: 0,
    });

    const createdProduct = await product.save();
    res.status(201).json({ success: true, product: createdProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a product (Seller/Admin)
// @route   PUT /api/products/:id
// @access  Private/Seller/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // Check ownership if seller
      if (req.user.role !== 'admin' && product.seller && product.seller.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to edit this product' });
      }

      product.name = req.body.name || product.name;
      product.price = req.body.price !== undefined ? req.body.price : product.price;
      product.discountPrice = req.body.discountPrice !== undefined ? req.body.discountPrice : product.discountPrice;
      product.description = req.body.description || product.description;
      product.shortDescription = req.body.shortDescription !== undefined ? req.body.shortDescription : product.shortDescription;
      product.images = req.body.images || product.images;
      product.category = req.body.category || product.category;
      product.brand = req.body.brand || product.brand;
      product.stock = req.body.stock !== undefined ? req.body.stock : product.stock;
      product.specifications = req.body.specifications || product.specifications;
      product.tags = req.body.tags || product.tags;
      product.isFeatured = req.body.isFeatured !== undefined ? req.body.isFeatured : product.isFeatured;
      product.isBestSeller = req.body.isBestSeller !== undefined ? req.body.isBestSeller : product.isBestSeller;
      product.isEcoChoice = req.body.isEcoChoice !== undefined ? req.body.isEcoChoice : product.isEcoChoice;

      const updatedProduct = await product.save();
      res.json({ success: true, product: updatedProduct });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a product (Seller/Admin)
// @route   DELETE /api/products/:id
// @access  Private/Seller/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      if (req.user.role !== 'admin' && product.seller && product.seller.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this product' });
      }

      await Product.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'Product removed successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new product review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
  try {
    const { rating, comment, title } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ success: false, message: 'Product already reviewed by you' });
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        title: title || '',
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ success: true, message: 'Review added successfully', product });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
};
