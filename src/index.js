#!/usr/bin/env node

const inquirer = require("inquirer");
const path = require("path");
const { writeFile, readdir, readFile, mkdir } = require("fs").promises;

const configFiles = {};
const configFolderPath = path.resolve(__dirname, "config");

const gitignoreFolderPath = path.resolve(__dirname, "gitignore");
const terraformFolderPath = path.resolve(__dirname, "terraform");


(async () => {
  const files = await readdir(configFolderPath).catch(console.log);

  for (let i of files) {
    const nodeType = i.split(".")[1];
    configFiles[nodeType] = path.join(configFolderPath, i);
  }

  const { technology, makeGitIgnore, makeTerraform, makeSrc } = await inquirer.prompt([
    {
      type: "list",
      message: "Pick the Node type",
      name: "technology",
      choices: ["node-default", "node-recommended","node-14", "node-16"],
    },
    {
      type: "confirm",
      message: "Do you want a /src directory",
      name: "makeSrc",
      default: true,
    },
    {
      type: "confirm",
      message: "Do you want a gitignore",
      name: "makeGitIgnore",
      default: true,
    },
    {
      type: "confirm",
      message: "Do you want a terraform boilerplate",
      name: "makeTerraform",
      default: true,
    },
  ]);

  const _tsconfig = await readFile(configFiles[technology]).catch(console.log);
  const tsconfig = path.join(process.cwd(), "tsconfig.json");

  await writeFile(tsconfig, _tsconfig.toString()).catch((e) => {
    console.log(e);
    process.exit(1);
  });
  console.log("tsconfig.json created\n");

  if (makeSrc) {
    try {
      await mkdir("./src");
    } catch (error) {
      console.log("did not make a /src directory\n");
    }
  }

  const _gitignore = await readFile(path.join(gitignoreFolderPath, "gitignore.txt")).catch(console.log);
  const gitignore = path.join(process.cwd(), ".gitignore");

  if (makeGitIgnore) {
    await writeFile(gitignore, _gitignore).catch((e) => {
      console.log(e);
      process.exit(1);
    });
    console.log(".gitignore created\n");
  }
  const _terraformFilenames = {
    "Makefile": "Makefile",
    "backend.tf": "backend.tf",
    "env.tfvars.json": "env.tfvars.json",
    "inputs.tf": "inputs.tf",
    "main.tf": "main.tf",
    "providers.tf": "providers.tf",
    "versions.tf": "versions.tf",
    "tsconfig.json": "tsconfig.json",
    "gitignore.txt": ".gitignore",
  };

  if (makeTerraform) {
    await mkdir("./terraform");
    const terraformFiles = await readdir(terraformFolderPath).catch(console.log);
    try {
      for (let file of terraformFiles) {
        const data = await readFile(path.join(terraformFolderPath, file));
        const newFileName = path.join(process.cwd(), "terraform", _terraformFilenames[file]);
        await writeFile(newFileName, data);
      }
      console.log("wrote terraform files\n");
    } catch (e) {
      console.log(e);
    }
  }
})();
