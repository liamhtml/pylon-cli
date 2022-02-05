#!/usr/bin/env node

const version = require("./package.json").version;
const fs = require("fs");
const access = require("fs/promises").access;
const readline = require("readline");
const nodeFetch = require("node-fetch");
const child_process = require("child_process");

const fileHeader = `/// <reference types="@pylonbot/runtime" />
/// <reference types="@pylonbot/runtime-discord" />
// This states that you are writing code using Pylon types, do not remove it if you want to your code to work!\n`;

let [, , ...args] = process.argv;
for (let i = 0; i < args.length; i++) {
    args[i].trim();
}

if (
    args[0] == "help" ||
    args[0] == "-h" ||
    args[0] == "--help" ||
    args.length == 0
) {
    if (args[1] == "help" || args[1] == "-h" || args[1] == "--help") {
        console.log("It's a help command. Is that really so hard to figure out?");
    } else {
        console.log(`
Pylon CLI v${version}

pylon help           - Displays this message
pylon <command> help - Displays more information about a command
pylon init           - Locally creates a new project, grabs the code from your Pylon online editor, \x1b[1musing 
                       this command will overwrite your locally saved code permanently, so be careful!\x1b[0m
pylon publish        - Publishes all of your scripts to the Pylon editor, \x1b[1musing 
                       this command will overwrite your Pylon editor code permanently, so be careful!\x1b[0m
pylon pull           - Pulls the code of your project from the Pylon editor, \x1b[1musing 
                       this command will overwrite your locally saved code permanently, so be careful!\x1b[0m
pylon version        - Displays Pylon CLI current version
        `);
    }
} else if (args[0] == "init" || args[0] == "i") {
    if (args[1] == "help" || args[1] == "-h" || args[1] == "--help") {
        console.log(
            `\`pylon init\` - Initiates a new Pylon project locally. You will need to have added Pylon to your server to start using it here.`
        );
    } else {
        console.log('Initiating new project');
        try {
            child_process.execSync(`npm i --save-dev typescript @rollup/plugin-typescript https://gitpkg.now.sh/pylonbot/pylon-sdk-types/runtime https://gitpkg.now.sh/pylonbot/pylon-sdk-types/runtime-discord`);
            child_process.execSync(`npm i -g rollup`);
        } catch(e) {
            console.log(e);
            process.exit();
        } finally {
            console.log('\x1b[32m✔️  Installed dependencies: rollup, typescript, @rollup/plugin-typescript, @pylonbot/runtime, @pylonbot/runtime-discord\x1b[0m')
        }

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

            console.log(
                'This bit\'s kinda weird. Login to https://pylon.bot, open Developer Tools > Storage > Local Storage > https://pylon.bot. \nYou should see a table with a part that says "token". The string next to this is your authentication token.'
            );
            rl.question("Pylon API token:  ", function (token) {
                console.log(
                    "\nOpen the script editor of the guild that you'd like to connect to. At this URL, you should see something like `/deployments/123456789/editor`. \nThis long number is your deployment ID."
                );
                rl.question("Deployment ID: ", async function (deployment_id) {

                    // fetch current script
                    let response = await nodeFetch(
                        `https://pylon.bot/api/deployments/${deployment_id}`,
                        {
                            method: "GET",
                            headers: {
                                Authorization: token,
                            },
                        }
                    );
                    if (!response.ok) {
                        console.log(
                            "Hmm, something went wrong. Probably either your Pylon API token or deployment ID was incorrect."
                        );
                        process.exit();
                    }
                    let editorData = await response.json();

                    console.log(
                        `\n\x1b[34mFound deployment to guild '${editorData.guild.name}'\x1b[0m`
                    );

                    const configContent = `{
    "token": "${token}", 
    "deployment_id": "${deployment_id}"
}`;
                    fs.writeFile(`config.json`, configContent, "utf8", () => { });
                    const gitignoreContent = `# Be careful with this: removing the line that ignores the config.json could lead to your Pylon token being exposed if you ever intend to put this project on GitHub.
*/config.json`;
                    fs.writeFile(`.gitignore`, gitignoreContent, "utf8", () => { });
                    fs.mkdir(`src/`, () => { });
                    console.log(`\x1b[32m➕ Created default folders and files\x1b[0m`);

                    // fetch current script
                    async function pull() {
                        function betterRmdir(path) {
                            if (fs.existsSync(path)) {
                                fs.readdirSync(path).forEach(function (file, index) {
                                    var curPath = path + "/" + file;
                                    if (fs.lstatSync(curPath).isDirectory()) {
                                        // recurse
                                        betterRmdir(curPath);
                                    } else {
                                        // delete file
                                        fs.unlinkSync(curPath);
                                    }
                                });
                                fs.rmdirSync(path);
                            }
                        }

                        let project = JSON.parse(editorData.script.project);
                        let files = project.files;

                        // remove source folder
                        betterRmdir(`src/`);

                        // reimport source folder
                        await fs.mkdir(`src/`, () => { });

                        for (let i = 0; i < files.length; i++) {
                            let paths = files[i].path.split("/");
                            function previousPaths(index) {
                                let previousPaths = "";
                                for (let a = 1; a < index; a++) {
                                    previousPaths = `${previousPaths}/${paths[a]}`;
                                }
                                return previousPaths;
                            }
                            for (let e = 0; e < paths.length; e++) {
                                // if it is a file path
                                if (e == paths.length - 1) {
                                    let content = files[i].content;
                                    if (paths[e].endsWith(".ts")) {
                                        content = `${fileHeader}${files[i].content}`;
                                    }
                                    if (files[i].path.endsWith(`${paths[e]}/`)) {
                                        await fs.mkdir(
                                            `src${previousPaths(e)}/${paths[e]}`,
                                            () => { }
                                        );
                                    } else {
                                        await fs.writeFile(
                                            `src${previousPaths(e)}/${paths[e]}`,
                                            content,
                                            "utf8",
                                            () => { }
                                        );
                                    }
                                } else {
                                    await fs.mkdir(
                                        `src/${previousPaths(e)}/${paths[e]}/`,
                                        () => { }
                                    );
                                }
                            }
                        }
                        console.log(
                            `\x1b[32m✔️  Successfully pulled ${files.length} item(s)\x1b[0m`
                        );
                    }

                    pull();

                    rl.close();
                });
            });
    }
} else if (args[0] == "publish" || args[0] == "p") {
    if (args[1] == "help" || args[1] == "-h" || args[1] == "--help") {
        console.log(
            `\`pylon publish\` - Publishes your local code to the Pylon editor and bot. You will need to have added Pylon to your server, and to have run the \`pylon init\` command to start using it.`
        );
    } else {
        try {
            fs.accessSync(`${process.cwd()}/config.json`);
        } catch {
            console.log(`\x1b[31mError: config.json file not found. Run \`pylon init\` before using this command.\x1b[0m`);
            process.exit();
        } 
        const config = require(`${process.cwd()}/config.json`);
        console.log(`\x1b[34mBundling project...\x1b[0m`);
        child_process.exec(
            `rollup src/main.ts --file bundle.ts --format cjs --no-strict -p @rollup/plugin-typescript`,
            async (err, stdout, sterr) => {
                if (err) {
                    console.log(err);
                    process.exit();
                }
                console.log(`\x1b[32m📦 Successfully bundled!\x1b[0m`);
                await fs.readFile(`bundle.ts`, "utf8", async (err, data) => {
                    if (err) {
                        console.log(err);
                        process.exit();
                    }
                    if (data.includes(fileHeader)) {
                        data.replace(fileHeader, "");
                    }

                    function getFiles(dir, files_) {
                        files_ = files_ || [];
                        var files = fs.readdirSync(dir);
                        for (var i in files) {
                            var name = dir + "/" + files[i];
                            if (fs.statSync(name).isDirectory()) {
                                getFiles(name, files_);
                            } else {
                                files_.push(name);
                            }
                        }
                        return files_;
                    }

                    let files = getFiles(`src/`, "");
                    let bodyFiles = [];
                    async function loopFiles() {
                        for (let i = 0; i < files.length; i++) {
                            let fileData = fs.readFileSync(files[i], "utf8");
                            if (fileData.includes(fileHeader)) {
                                fileData = fileData.replace(fileHeader, "");
                            }
                            bodyFiles.push({
                                path: files[i].replace(`src/`, ""),
                                content: fileData,
                            });
                            if (i == files.length - 1) {
                                publish(bodyFiles);
                            }
                        }
                    }
                    loopFiles();

                    async function publish(bodyFiles) {
                        const reqBody = JSON.stringify({
                            script: {
                                contents: data,
                                project: {
                                    files: bodyFiles,
                                },
                            },
                        });
                        let response = await nodeFetch(
                            `https://pylon.bot/api/deployments/${config.deployment_id}`,
                            {
                                method: "POST",
                                headers: {
                                    Authorization: config.token,
                                },
                                body: reqBody,
                            }
                        );
                        if (!response.ok) {
                            console.log(`${response.status}: ${response.statusText}`);
                            process.exit();
                        } else {
                            console.log(`\x1b[32m✔️  Published!\x1b[0m`);
                        }
                    }
                });
            }
        );
    }
} else if (args[0] == "pull") {
    if (args[1] == "help" || args[1] == "-h" || args[1] == "--help") {
        console.log(
            `\`pylon pull\` - Pulls your code from the Pylon editor. You will need to have added Pylon to your server, and to have run the \`pylon init\` command to start using it.`
        );
    } else {
        try {
            fs.accessSync(`${process.cwd()}/config.json`);
        } catch {
            console.log(`\x1b[31mError: config.json file not found. Run \`pylon init\` before using this command.\x1b[0m`);
            process.exit();
        } 
        const config = require(`${process.cwd()}/config.json`);

        // fetch current script
        async function pull() {
            let response = await nodeFetch(
                `https://pylon.bot/api/deployments/${config.deployment_id}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: config.token,
                    },
                }
            );
            if (!response.ok) {
                console.log(
                    "Hmm, something went wrong. Probably either your Pylon API token or deployment ID was incorrect."
                );
                process.exit();
            }

            function betterRmdir(path) {
                if (fs.existsSync(path)) {
                    fs.readdirSync(path).forEach(function (file, index) {
                        var curPath = path + "/" + file;
                        if (fs.lstatSync(curPath).isDirectory()) {
                            // recurse
                            betterRmdir(curPath);
                        } else {
                            // delete file
                            fs.unlinkSync(curPath);
                        }
                    });
                    fs.rmdirSync(path);
                }
            }

            let editorData = await response.json();
            console.log(
                `\n\x1b[34mFound deployment to guild '${editorData.guild.name}'\x1b[0m`
            );
            let project = JSON.parse(editorData.script.project);
            let files = project.files;

            // remove source folder
            betterRmdir(`src/`);

            // reimport source folder
            await fs.mkdir(`src/`, () => { });

            for (let i = 0; i < files.length; i++) {
                let paths = files[i].path.split("/");
                function previousPaths(index) {
                    let previousPaths = "";
                    for (let a = 1; a < index; a++) {
                        previousPaths = `${previousPaths}/${paths[a]}`;
                    }
                    return previousPaths;
                }
                for (let e = 0; e < paths.length; e++) {
                    // if it is a file path
                    if (e == paths.length - 1) {
                        let content = files[i].content;
                        if (paths[e].endsWith(".ts")) {
                            content = `${fileHeader}${files[i].content}`;
                        }
                        if (files[i].path.endsWith(`${paths[e]}/`)) {
                            await fs.mkdir(`src${previousPaths(e)}/${paths[e]}`, () => { });
                        } else {
                            await fs.writeFile(
                                `src${previousPaths(e)}/${paths[e]}`,
                                content,
                                "utf8",
                                () => { }
                            );
                        }
                    } else {
                        await fs.mkdir(`src/${previousPaths(e)}/${paths[e]}/`, () => { });
                    }
                }
            }
            console.log(
                `\x1b[32m✔️  Successfully pulled ${files.length} item(s)\x1b[0m`
            );
        }

        pull();
    }
} else if (args[0] == "version" || args[0] == "-v" || args[0] == "--version") {
    if (args[1] == "help" || args[1] == "-h" || args[1] == "--help") {
        console.log(`\`pylon version\` - Checks current version of Pylon CLI`);
    } else {
        const version = require("./package.json").version;
        console.log(`v${version}`);
    }
} else {
    console.log("Command not found. Try `pylon help`");
}
