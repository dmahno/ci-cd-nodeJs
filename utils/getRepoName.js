import last from 'lodash/last';

const getRepoName = (url) => last(url.split('/'));

export default getRepoName;
