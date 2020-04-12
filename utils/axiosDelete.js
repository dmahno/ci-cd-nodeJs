const requestDecorator = require('./requestDecorator');

module.exports = async function axiosDelete(instance, url, data) {
  const response = await requestDecorator(instance.delete, url, data);
  console.log('---\nDELETE ', url, '\n', response.short, '\n---');
  return response;
};