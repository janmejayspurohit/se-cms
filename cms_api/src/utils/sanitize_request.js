const sanitizeRequest = (request, permittedValues, permitKey = "permitted") => {
  request[permitKey] = Object.assign(request[permitKey] || {}, permittedValues);

  return { ...request };
};

module.exports = sanitizeRequest;
