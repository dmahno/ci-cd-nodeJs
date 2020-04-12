import path from 'path';

const getPathToLocalRepo = (repoName) => path.resolve(__dirname, '..', 'tmp', repoName);

export default getPathToLocalRepo;
