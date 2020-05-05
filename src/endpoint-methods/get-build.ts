import { getAllBuildDetailsFromYandex } from "../yandex-endpoints";
import { Request, Response, NextFunction } from 'express';

// Method to fetch all builds data from yandex server
export const getBuildDetails = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const build: Object = await getAllBuildDetailsFromYandex(req.params.buildId);
		res.send(build);
	} catch (error) {
		res.status(500).send(error);
	}
}