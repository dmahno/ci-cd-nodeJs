import axios from 'axios';
import https from 'https';
import dotenv from 'dotenv';

dotenv.config();

const { TOKEN } = process.env;
const DB_API = 'https://hw.shri.yandex/api/';

const callApi = async ({
  method,
  url,
  data,
  params,
// eslint-disable-next-line consistent-return
}) => {
  axios.defaults.httpsAgent = new https.Agent({ rejectUnauthorized: false });
  axios.defaults.baseURL = DB_API;
  axios.defaults.headers.common.Authorization = `Bearer ${TOKEN}`;

  try {
    const response = await axios({
      method,
      url,
      data,
      params,
    });

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default callApi;
