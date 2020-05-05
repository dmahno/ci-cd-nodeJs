import { getSettingsFromYandex } from "../yandex-endpoints";
import { Request, Response, NextFunction } from 'express';

// Method to fetch setings data from yandex server
export const getSettings = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const settings: Object = await getSettingsFromYandex();
		res.send(settings);
	} catch (error) {
		res.status(500).send(error);
	}
}

