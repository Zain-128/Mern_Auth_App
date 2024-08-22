export const ErrorHandler = (error, req, res, next) => {
  return res.status(error.status || 500).json({
    message: error.message || "Internal Server Error ! ",
    data: null,
    success: false,
  });
};
