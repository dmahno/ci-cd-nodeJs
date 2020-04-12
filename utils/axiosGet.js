const requestDecorator = require('./requestDecorator');

module.exports = async function axiosGet(instance, url, data) {
  const response = await requestDecorator(instance.get, url, data);
  console.log('---\nGET ', url, '\n', response.short, '\n---');
  return response;
};