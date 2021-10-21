#!/usr/bin/env node
// @ts-check
const inquirer = require("inquirer");
const path = require("path");
const { writeFile, readdir, readFile, mkdir } = require("fs").promises;

const tsConfigFiles = {};

const _folder = {
  tsconfig    : path.resolve(__dirname, "tsconfig"),
  gitignore   : path.resolve(__dirname, "gitignore"),
  terraform   : path.resolve(__dirname, "terraform"),
  prettier    : path.resolve(__dirname, "prettier"),
  readme      : path.resolve(__dirname, "readme"),
  packagejson : path.resolve(__dirname, "packagejson"),
  vscode      : path.resolve(__dirname, "vscode")
}

const _terraformFilenames = {
  "Makefile"        : "Makefile",
  "backend.tf"      : "backend.tf",
  "env.tfvars.json" : "env.tfvars.json",
  "inputs.tf"       : "inputs.tf",
  "main.tf"         : "main.tf",
  "providers.tf"    : "providers.tf",
  "versions.tf"     : "versions.tf",
  "tsconfig.json"   : "tsconfig.json",
  "gitignore.txt"   : ".gitignore",
};

(async () => {
  const files = await readdir(_folder.tsconfig).catch(handleExit);

  if (Array.isArray(files)) {
    files.forEach((file) => {
      const nodeType = file.split(".")[1];
      tsConfigFiles[nodeType] = path.join(_folder.tsconfig, file);
    })
  }

  const { lowerProjectName, technology } = await inquirer.prompt([
    {
      type      : "input",
      message   : "What's your project name?",
      name      : "lowerProjectName",
      default   : "my-project",
    },
    {
      type      : "list",
      message   : "Pick the Node type",
      name      : "technology",
      choices   : ["node-default", "node-recommended", "node-14", "node-16"],
    },
  ]);

  const projectName = lowerProjectName.toLowerCase();

  await mkdir(`./${projectName}`).catch(handleExit);

  const projectPath = path.join(process.cwd(), projectName);

  await mkdir(`${projectPath}/src`);

  // tsconfig
  const _tsconfigData = await _read(tsConfigFiles[technology])
  const tsconfig = path.join(projectPath, "tsconfig.json");
  await writeFile(tsconfig, _tsconfigData).catch(handleExit);

  // gitignore
  const _gitignoreData = await _read(path.join(_folder.gitignore, "gitignore.txt"))
  const gitignore = path.join(projectPath, ".gitignore");
  await writeFile(gitignore, _gitignoreData).catch(handleExit);

  // prettierignore
  const _prettierIgnore = await _read(path.join(_folder.prettier, "prettierignore"))
  const prettierIgnore = path.join(projectPath, ".prettierignore");
  await writeFile(prettierIgnore, _prettierIgnore).catch(handleExit);

  // prettierrc
  const _prettierRcData = await _read(path.join(_folder.prettier, "prettierrc.json"))
  const prettierRc = path.join(projectPath, ".prettierrc.json");
  await writeFile(prettierRc, _prettierRcData).catch(handleExit);

  // readme
  const _readmeData = await _read(path.join(_folder.readme, "README.md"));
  const readme = path.join(projectPath, "README.md");
  await writeFile(readme, replaceInBuffer(_readmeData, projectName)).catch(handleExit);

  // terraform
  const terraformPath = `${projectPath}/terraform`;
  await mkdir(terraformPath);
  const terraformFiles = await readdir(_folder.terraform).catch(handleExit);
  if (Array.isArray(terraformFiles)) {
    terraformFiles.forEach(async (file) => {
      const data = await _read(path.join(_folder.terraform, file));
      const newFilename = path.join(terraformPath, _terraformFilenames[file]);
      await writeFile(newFilename, replaceInBuffer(data, projectName)).catch(handleExit);
    });
  }

  // package.json
  const _packagejsonData = await _read(path.join(_folder.packagejson, "package.json"));
  const packagejson = path.join(projectPath, "package.json");
  await writeFile(packagejson, replaceInBuffer(_packagejsonData, projectName)).catch(handleExit);

  // .vscode
  const vscodePath = `${projectPath}/.vscode`;
  await mkdir(vscodePath);
  const vscodeFiles = await readdir(_folder.vscode).catch(handleExit);
  if (Array.isArray(vscodeFiles)) {
    vscodeFiles.forEach(async (file) => {
      const data = await _read(path.join(_folder.vscode, file));
      const newFileName = path.join(vscodePath, file);
      await writeFile(newFileName, replaceInBuffer(data, projectName)).catch(handleExit);
    });
  }

  console.log("\nSuccess! - Files created!\n");
  console.log(`cd ${projectName}\n`);

})();

/**
 *
 * @param {Error|string} error
 */
function handleExit(error = "Error. Exiting.") {
  console.log(error);
  process.exit(1);
}

/**
 *
 * @param {Buffer} data
 * @param {string} filename
 * @returns {Buffer}
 */
function replaceInBuffer(data, filename) {
  if (filename === "my-project") {
    return data;
  }
  const stringData = data.toString();
  const modifiedData = stringData.replace(/my-project/g, filename);
  return Buffer.from(modifiedData, "utf8");
}

/**
 *
 * @param {string} path
 * @returns {Promise<Buffer>}
 */
async function _read(path) {
  const buff = await readFile(path).catch(handleExit);
  if (Buffer.isBuffer(buff)) {
    return buff;
  } else {
    handleExit(`Error. Could not read ${path}`);
  }
}
