// Process imports
import { Router } from 'express';
import { getSettings } from '../endpoint-methods/get-settings';
import { updateSettings } from '../endpoint-methods/update-settings';
import { getBuilds } from '../endpoint-methods/get-builds';
import { getBuildDetails } from '../endpoint-methods/get-build';
import { getBuildLogs } from '../endpoint-methods/get-build-logs';
import { requestBuild } from '../endpoint-methods/request-build';

// Create an instance of express router
const api: Router = Router();

// Group and handle settings routes
api.route('/settings')
	.get(getSettings)
	.post(updateSettings);

// Handle builds GET
api.route('/builds')
	.get(getBuilds)

// Handle builds/:commithash POST
api.route('/builds/:commitHash')
	.post(requestBuild)

// Handle builds/:buildId GET
api.route('/builds/:buildId')
	.get(getBuildDetails)

// Handle builds/:buildId/logs GET
api.route('/builds/:buildId/logs')
	.get(getBuildLogs)


export default api;