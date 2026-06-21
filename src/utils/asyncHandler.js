/**
 * Async Error Handler Wrapper
 * Wraps async controller functions to catch errors automatically
 * Eliminates need for try-catch in every route
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
