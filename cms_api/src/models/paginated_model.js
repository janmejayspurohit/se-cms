/**
 *
 * @param {import("sequelize").ModelStatic} Model
 * @param {*} options
 * @param {Object} paginationOptions
 * @param {Number} paginationOptions.page
 * @param {Number} paginationOptions.size
 */
const PaginatedModel = async (Model, options = {}, paginationOptions = {}) => {
  let { page = 0, size = 10 } = paginationOptions;
  if (page) page -= 1;
  size = parseInt(size);

  const offset = page * size;
  const limit = size;

  const _count = await Model.count({ ...options });
  const rows = await Model.findAll({
    ...options,
    offset,
    limit,
  });
  page += 1;

  const pageCount = Math.ceil(_count / size);
  return {
    size,
    page,
    pageCount,
    items: rows,
    total: _count,
  };
};

module.exports = PaginatedModel;
