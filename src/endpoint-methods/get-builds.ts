import { getAllBuildsFromYandex } from "../yandex-endpoints";
import { Request, Response, NextFunction } from 'express';

// Method to fetch all builds data from yandex server
export const getBuilds = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const builds: Object = await getAllBuildsFromYandex();
		res.send(builds);
	} catch (error) {
		res.status(500).send(error);
	}
}