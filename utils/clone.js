import Git from 'nodegit';

const clone = async (pathToRemoteRepo, pathToLocalRepo) => {
  const cloneOptions = {
    fetchOpts: {
      callbacks: {
        certificateCheck() { return 0; }, // required for OS X
        credentials(url, userName) {
          return Git.Cred.sshKeyFromAgent(userName);
        },
      },
    },
  };

  await Git.Clone(pathToRemoteRepo, pathToLocalRepo, cloneOptions);
};

export default clone;
