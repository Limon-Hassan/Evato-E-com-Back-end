const productScema = require('../Model/productScema');
const SearchHistory = require('../Model/searchSchema');
const { getIO } = require('../socket');

async function searchProducts(req, res, next) {
  try {
    let { query, minPrice, maxPrice, sort, userId } = req.query;
    query = query?.trim();

    let filter = {};

    const orArray = [];
    if (query) {
      orArray.push({ name: { $regex: query, $options: 'i' } });
      orArray.push({ discription: { $regex: query, $options: 'i' } });
    }

    if (minPrice || maxPrice) {
      const priceFilter = {};
      if (minPrice) priceFilter.$gte = Number(minPrice);
      if (maxPrice) priceFilter.$lte = Number(maxPrice);

      if (orArray.length > 0) {
        orArray.forEach(item => (item.price = priceFilter));
      } else {
        filter.price = priceFilter;
      }
    }

    if (orArray.length > 0) filter.$or = orArray;

    let sortOption = {};
    if (sort === 'lowToHigh') sortOption.price = 1;
    if (sort === 'highToLow') sortOption.price = -1;

    let products = await productScema
      .find(filter)
      .sort(sortOption)
      .populate({ path: 'category', select: 'name discription image' });

    let related = [];
    if (products.length > 0) {
      let categoryIds = products
        .map(p =>
          Array.isArray(p.category)
            ? p.category.map(c => c._id)
            : p.category?._id || p.category
        )
        .flat();

      let relatedFilter = {
        category: { $in: categoryIds },
        _id: { $nin: products.map(p => p._id) },
      };

      if (minPrice || maxPrice) {
        relatedFilter.price = {};
        if (minPrice) relatedFilter.price.$gte = Number(minPrice);
        if (maxPrice) relatedFilter.price.$lte = Number(maxPrice);
      }

      related = await productScema
        .find(relatedFilter)
        .sort(sortOption)
        .limit(10)
        .populate({ path: 'category', select: 'name discription image' });
    }

    if (userId && query) await SearchHistory.create({ user: userId, query });

    if (query && userId) {
      getIO()
        .to(userId.toString())
        .emit('searchSuggestion', {
          query,
          suggestions: products.map(p => p.name).slice(0, 5),
        });
    }

    return res.status(200).json({
      msg: 'Search results',
      count: products.length,
      products,
      related,
    });
  } catch (error) {
    next(error);
    return res.status(500).json({ msg: 'Server error', error: error.message });
  }
}

module.exports = { searchProducts };
