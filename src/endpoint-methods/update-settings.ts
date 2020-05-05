import { updateSettingsInYandex } from "../yandex-endpoints";
import fs from "fs";
import rimraf from "rimraf";
import Git from "nodegit";
import { Request, Response, NextFunction } from 'express';

// Method to fetch setings data from yandex server
export const updateSettings = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const settings: Settings = req.body;
		await initializeGitRepo(settings.repoName)
		await updateSettingsInYandex(settings);
		res.send({
			message: "Updated successfully"
		});
	} catch (error) {
		res.status(500).send(error);
	}
}

const initializeGitRepo = (repoName: string) => {
	return new Promise(async (resolve, reject) => {
		const pathToLocalRepo = "temp"
		const repoPath = "https://github.com/" + repoName;
		// Delete the old repo dir
		rimraf.sync("temp");
		// Create it
		fs.mkdirSync(pathToLocalRepo);
		// Clone new repo
		Git.Clone.clone(repoPath, pathToLocalRepo).then(function (repository: Object) {
			// Use repository
			resolve();
		}).catch((err: Object) => {
			reject(err);
		});
	});
}

type Settings = {
	repoName: string,
	buildCommand: string,
	mainBranch: string,
	minutes: string
};