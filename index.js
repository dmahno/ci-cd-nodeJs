const path = require("path");
const util = require("util");
var cors = require("cors");
const querystring = require("querystring");
const { exec } = require("child_process");
const execPromisified = util.promisify(exec);
const Git = require("nodegit");
var fs = require('fs');
var rimraf = require("rimraf");

const dotenv = require("dotenv");
dotenv.config({
  path: path.resolve(__dirname, "..", ".env")
});
const apiToken = process.env["API_TOKEN"];
const express = require("express");
const https = require("https");
const axios = require("axios");

const api = axios.create({
  baseURL: "https://hw.shri.yandex/api",
  timeout: 5000,
  headers: {
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjU4ODU1ODI4IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ImRtYWhubyIsInVybjpnaXRodWI6dXJsIjoiaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS91c2Vycy9kbWFobm8iLCJuYmYiOjE1ODU3NDAwNjMsImV4cCI6MTU4ODMzMjA2MywiaXNzIjoiU2hyaS1Ib21ld29yayIsImF1ZCI6IlNocmktSG9tZXdvcmsifQ.OSUVJqN6VU8ruR_MtyXbWHo5gnjPEL_DjJ8-SURp0TA"
  },
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});

const axiosGet = require("./utils/axiosGet");
const axiosPost = require("./utils/axiosPost");
const axiosDelete = require("./utils/axiosDelete");

let repoName = null,
  buildCommand,
  mainBranch,
  period,
  timeoutId = null,
  lastHashCommit,
  pathToRepo;

const startUpdate = () => {
  clearTimeout(timeoutId);
  // очистить папку с репой && выкачать репу && перейти на нужную ветку
  const pathToLocalRepo = path.resolve(__dirname, "localRepo");
  pathToRepo = path.resolve(__dirname, "localRepo", repoName.split("/")[1]);
  exec(
    `cd ${pathToLocalRepo} && rm -r ${pathToLocalRepo}/* && git clone https://github.com/${repoName}.git && cd ${pathToRepo} && git checkout ${mainBranch}`,
    (error, out) => {
      if (error) {
        console.error(error);
      } else {
        console.log(out);

        // запомнить хэш последнего коммита на ветке
        execPromisified(`cd ${pathToRepo} && git rev-parse --short HEAD`)
          .then(out => {
            lastHashCommit = out;
            console.log("lastHashCommit: ", lastHashCommit);

            // TODO:
            // запустить билд
            exec(`cd ${pathToRepo} && ${buildCommand}`, (error1, out1) => {
              if (error1) {
                console.error(error1);
              } else {
                console.log(out1);
                timeoutId = setTimeout(update, period);
              }
            });
          })
          .catch(err => console.error(err));
      }
    }
  );
};
const update = () => {
  if (repoName === null) return;

  console.log("check repo for new commits");

  // get hash of last commit on mainBranch
  execPromisified(
    `cd ${pathToRepo} && git pull --quiet && git rev-parse --short HEAD`
  )
    .then(out => {
      lastHashCommitNow = out;
      console.log(
        "lastHashCommit: ",
        lastHashCommit,
        "lastHashCommitNow: ",
        lastHashCommitNow
      );

      if (lastHashCommitNow === lastHashCommit) return;

      // TODO:
      // запустить билд
      exec(`cd ${pathToRepo} && ${buildCommand}`, (error1, out1) => {
        if (error1) {
          console.error(error1);
        } else {
          console.log(out1);
          timeoutId = setTimeout(update, period);
        }
      });
    })
    .catch(err => console.error(err));
};

const app = express();

app.use(cors());

app.use(express.static(path.resolve(__dirname, "static")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/settings", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const { full, short } = await axiosGet(api, "/conf");
  console.log("short :", short);
  res.end(JSON.stringify(short));
});

app.post("/api/settings", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  // Extract data
  const { repository, command, branch, minutes } = req.body;
  repoName = repository;
  buildCommand = command;
  mainBranch = branch;
  period = Number(minutes) * 60 * 1000;
  try {
    // Add repo locally
    await initializeGitRepo(repoName);
    // Add to server
    const params = {
      repoName: repository,
      buildCommand: command,
      mainBranch: branch,
      period: Number(minutes)
    };
    const { full, short } = await axiosPost(api, "/conf", params);
    // Return response
    res.end(JSON.stringify(short));
  } catch (error) {
    if (error.errno && error.errno === -1) {
      res.end(JSON.stringify({
        error: true,
        errorMessage: "not a valid git repo"
      }));
    } else {
      res.end(JSON.stringify(error));
    }
  }
});

app.get("/api/settings/delete", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const { full, short } = await axiosDelete(api, "/conf");

  // stop cheking repo by interval
  clearTimeout(timeoutId);
  repoName = null;

  res.end(JSON.stringify(short));
});

app.get("/api/builds", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const { offset, limit } = req.query;

  const params = {};
  if (offset !== undefined) {
    params.offset = offset;
  }
  if (limit !== undefined) {
    params.limit = limit;
  }

  let queryUrl = "/build/list";
  const paramsEncoded = querystring.encode(params);
  if (paramsEncoded !== "") {
    queryUrl += `/?${paramsEncoded}`;
  }

  const { full, short } = await axiosGet(api, queryUrl);

  res.end(JSON.stringify(short));
});

app.post("/api/builds/:commitHash", async (req, res) => {
  // Set response header 
  res.setHeader("Content-Type", "application/json");
  // Extract commit hash from request url
  const commitHash = req.params.commitHash;
  // Get repoName and username from database (yandex API)
  let queryUrl = "/conf";
  try {
    const { short } = await axiosGet(api, queryUrl);
    if (short && short.data && short.data.data) {
      console.log('1 :', 1);
      // Valid settings found
      const { mainBranch: branchName, repoName, buildCommand } = short.data.data;
      // Execute git commands
      console.log('getPathToLocalRepo(repoName) :', getPathToLocalRepo(repoName));
      const pathToLocalRepo = getPathToLocalRepo(repoName);
      Git.Repository.open("temp", async (err, repo) => {
        console.log('err, repo :', err, repo);
        console.log('repo :', repo);
        const commit = await repo.getCommit(commitHash);
        const commitMessage = commit.message();
        const authorName = commit.author().name();
        console.log(3);
        const data = {
          commitMessage,
          commitHash,
          branchName,
          authorName,
        };
        // Send the build request to server
        console.log('data :', data);
        const { short: buildResponse } = await axiosPost(api, "/build/request", data);
        // Send response
        res.end(JSON.stringify(buildResponse));
      });
    } else {
      console.log(2);
      // No valid settings found
    }
  } catch (error) {
    // Error occuered
    res.end(JSON.stringify(error));
  }
  
});

app.get("/api/builds/:buildId", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const buildId = req.params.buildId;

  const params = {
    buildId
  };

  const paramsEncoded = querystring.encode(params);
  const queryUrl = `/build/details/?${paramsEncoded}`;

  const { full, short } = await axiosGet(api, queryUrl);

  res.end(JSON.stringify(short));
});

app.get("/api/builds/:buildId/logs", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const buildId = req.params.buildId;

  const params = {
    buildId
  };

  const paramsEncoded = querystring.encode(params);
  const queryUrl = `/build/log/?${paramsEncoded}`;

  const { full, short } = await axiosGet(api, queryUrl);

  res.end(JSON.stringify(short));
});

const port = process.env["PORT"] || 3000;

app.listen(port);

const getPathToLocalRepo = (repoName) => path.resolve(__dirname, '..', 'tmp', repoName);

const initializeGitRepo = repoName => {
  return new Promise(async (resolve, reject) => {
    const pathToLocalRepo = "temp"
    const repoPath = "https://github.com/"+repoName;
    // Delete the old repo dir
    rimraf.sync("temp");
    // Create it
    fs.mkdirSync(pathToLocalRepo);
    // Clone new repo
    Git.Clone(repoPath, pathToLocalRepo).then(function(repository) {
      // Use repository
      resolve();
    }).catch(err => {
      reject(err);
    });
  });
}