import faker from 'faker';

const build = ({ buildCommand, branchName, repoName }) => new Promise((resolve) => {
  console.log(`building '${branchName}' in '${repoName}' with '${buildCommand}'`);
  const duration = faker.random.number({ min: 1000, max: 3000 });
  const log = faker.lorem.paragraph(10);
  const success = faker.random.boolean();

  setTimeout(() => {
    resolve({ duration, log, success });
  }, duration);
});

export default build;
