import { getAllBuildLogsFromYandex } from "../yandex-endpoints";
import { Request, Response, NextFunction } from 'express';

// Method to fetch all builds data from yandex server
export const getBuildLogs = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const buildLogs: Object = await getAllBuildLogsFromYandex(req.params.buildId);
		res.send(buildLogs);
	} catch (error) {
		res.status(500).send(error);
	}
}