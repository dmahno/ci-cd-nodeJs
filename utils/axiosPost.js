const requestDecorator = require('./requestDecorator');

module.exports = async function axiosPost(instance, url, data) {
  const response = await requestDecorator(instance.post, url, data);
  console.log('---\nPOST ', url, '\n', response.short, '\n---');
  return response;
};