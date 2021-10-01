#!/usr/bin/env node

const inquirer = require("inquirer");
const path = require("path");
const { writeFile, readdir, readFile } = require("fs").promises;

const configFiles = {};
const configFolderPath = path.resolve(__dirname, "config");

const configFolderPath = path.resolve(__dirname, "config");
const gitignoreFolderPath = path.resolve(__dirname, "gitignore");

async () => {
  const files = await readdir(configFolderPath).catch(console.log);

  for (let i of files) {
    const nodeType = i.split(".")[1];
    configFiles[nodeType];
  }

  const { technology, makeGitIgnore } = await inquirer.prompt([
    {
      type: "list",
      message: "Pick the Node type",
      name: "technology",
      choices: Object.keys(configFiles),
    },
    {
      type: "confirm",
      message: "Do you want a gitignore",
      name: "makeGitIgnore",
      default: true,
    },
  ]);

  const _tsconfig = await readFile(configFiles[technology]).catch(console.log);
  const tsconfig = path.join(process.cwd(), "tsconfig.json");
  const _gitignore = await readFile(configFiles[technology]).catch(console.log);
  const gitignore = path.join(process.cwd(), ".gitignore");

  await writeFile(tsconfig, _tsconfig.toString()).catch((e) => {
    console.log(e);
    process.exit(1);
  });

  if (makeGitIgnore) {
    await writeFile(gitignore, _gitignore).catch((e) => {
      console.log(e);
      process.exit(1);
    });
  }

  console.log("tsconfig.json created");
};
