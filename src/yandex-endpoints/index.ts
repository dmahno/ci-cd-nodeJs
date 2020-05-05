// Contains all yandex server calls

// Imports
import axios from "axios";

// Disable certificate check as yandex server does not have a valid ssl certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Configure axios
// Set base url
axios.defaults.baseURL = process.env.YANDEX_BASE_URL;
// Intercept AUthorization token in all requests
axios.interceptors.request.use(config => {
	config.headers.Authorization = 'Bearer ' + process.env.YANDEX_TOKEN;
	return config;
}, error => {
	// handle the error
	return Promise.reject(error);
});

// Yandex endpoints wrapper methods
export const getSettingsFromYandex = async () => {
	try {
		const response = await axios.get("/conf");
		if (response.status === 200) {
			return response.data;
		} else {
			throw Error('Response recieved with code ' + response.status);
		}
	} catch (error) {
		throw Error('Server error: ' + JSON.stringify(error));
	}
}

export const updateSettingsInYandex = async (settings: Object) => {
	try {
		const response = await axios.post("/conf", settings);
		if (response.status === 200) {
			return response.data;
		} else {
			throw Error('Response recieved with code ' + response.status);
		}
	} catch (error) {
		throw Error('Server error: ' + JSON.stringify(error));
	}
}

export const getAllBuildsFromYandex = async () => {
	try {
		const response = await axios.get("/build/list");
		if (response.status === 200) {
			return response.data;
		} else {
			throw Error('Response recieved with code ' + response.status);
		}
	} catch (error) {
		throw Error('Server error: ' + JSON.stringify(error));
	}
}

export const getAllBuildDetailsFromYandex = async (buildId: String) => {
	try {
		const response = await axios.get(`/build/details?buildId=${buildId}`);
		if (response.status === 200) {
			return response.data;
		} else {
			throw Error('Response recieved with code ' + response.status);
		}
	} catch (error) {
		throw Error('Server error: ' + JSON.stringify(error));
	}
}

export const getAllBuildLogsFromYandex = async (buildId: String) => {
	try {
		const response = await axios.get(`/build/log?buildId=${buildId}`);
		if (response.status === 200) {
			return response.data;
		} else {
			throw Error('Response recieved with code ' + response.status);
		}
	} catch (error) {
		throw Error('Server error: ' + JSON.stringify(error));
	}
}

export const addBuildRequestToYandex = async (buildRequestData: Object) => {
	try {
		const response = await axios.post(`/build/request`, buildRequestData);
		if (response.status === 200) {
			return response.data;
		} else {
			throw Error('Response recieved with code ' + response.status);
		}
	} catch (error) {
		throw Error('Server error: ' + JSON.stringify(error));
	}
}