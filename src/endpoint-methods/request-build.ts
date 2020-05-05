import { getSettingsFromYandex, addBuildRequestToYandex } from "../yandex-endpoints";
import { Request, Response, NextFunction } from 'express';
import Git, { Repository } from "nodegit";

// Method to fetch setings data from yandex server
export const requestBuild = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Extract commit hash from request url
		const commitHash = req.params.commitHash;
		// Get reponame and branchname
		const settings: settingsResponse = await getSettingsFromYandex();
		// Extract commit details from repo
		const repo: Repository = await Git.Repository.open("temp");
		const commit = await repo.getCommit(commitHash);
		const commitMessage = commit.message();
		const authorName = commit.author().name();
		const buildData = {
			commitMessage,
			commitHash,
			branchName: settings.data.mainBranch,
			authorName,
		};
		// Send the build request to server
		await addBuildRequestToYandex(buildData);
		// Send response
		res.send({
			message: "Build request added"
		})
	} catch (error) {
		res.status(500).send(error);
	}
}

type settingsResponse = {
	[data: string]: {
		repoName: string,
		buildCommand: string,
		mainBranch: string,
		minutes: string
	}
};