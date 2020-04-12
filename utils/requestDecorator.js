module.exports = async (method, url, data) => {
  let response,
      full,
      short;

  try {
    full = await method(url, data);
    short = {
      status: full.status,
      data: full.data
    };
  } catch (error) {
    short = {
      error: error.message
    };
  }

  response = {
    full,
    short
  };
  return response;
};