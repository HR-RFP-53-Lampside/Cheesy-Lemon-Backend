const handleResponse = (res, code, statusMessage) => {
  res.status(code).json({ status: statusMessage });
};
module.exports = handleResponse;
