// Standardized API response utilities

const sendSuccess = (res, message, data = null, statusCode = 200) => {
  const response = {
    success: true,
    message,
    timestamp: new Date().toISOString()
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

const sendError = (res, message, statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

const sendValidationError = (res, errors) => {
  return sendError(res, 'Validation failed', 400, errors);
};

const sendNotFound = (res, resource = 'Resource') => {
  return sendError(res, `${resource} not found`, 404);
};

const sendUnauthorized = (res, message = 'Unauthorized access') => {
  return sendError(res, message, 401);
};

const sendForbidden = (res, message = 'Access forbidden') => {
  return sendError(res, message, 403);
};

const sendServerError = (res, message = 'Internal server error') => {
  return sendError(res, message, 500);
};

// Pagination helper
const getPaginationData = (page, limit, total) => {
  const currentPage = parseInt(page) || 1;
  const itemsPerPage = parseInt(limit) || 10;
  const totalPages = Math.ceil(total / itemsPerPage);
  const skip = (currentPage - 1) * itemsPerPage;

  return {
    pagination: {
      currentPage,
      totalPages,
      totalItems: total,
      itemsPerPage,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
      nextPage: currentPage < totalPages ? currentPage + 1 : null,
      prevPage: currentPage > 1 ? currentPage - 1 : null
    },
    skip,
    limit: itemsPerPage
  };
};

// Success responses with pagination
const sendSuccessWithPagination = (res, message, data, paginationInfo) => {
  return res.json({
    success: true,
    message,
    data,
    pagination: paginationInfo,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  sendSuccess,
  sendError,
  sendValidationError,
  sendNotFound,
  sendUnauthorized,
  sendForbidden,
  sendServerError,
  getPaginationData,
  sendSuccessWithPagination
};