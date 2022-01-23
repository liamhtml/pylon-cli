#!/usr/bin/env node

const version = require('./package.json').version;
const fs = require('fs');
const access = require('fs/promises').access;
const readline = require('readline');
const nodeFetch = require('node-fetch');
const exec = require('child_process');

let [, , ...args] = process.argv
for (let i = 0; i < args.length; i++) {
    args[i].trim();
}

/*
    DONE pylon help (-h, --help)
    pylon [command] help
    DONE pylon init [project name]
    pylon publish [project folder path]
    DONE pylon pull [project folder path]
    DONE pylon version (-v, --version)
*/

if (args[0] == 'help' || args[0] == '-h' || args[0] == '--help' || args.length == 0) {
    console.log(`
    Pylon CLI v${version}

    pylon help                           - Displays this message
    pylon [command] help                 - Displays more information about a command
    pylon init                           - Locally creates a new project, grabs the code from your Pylon online editor, \x1b[1musing 
                                           this command will overwrite your locally saved code permanently, so be careful!\x1b[0m
    pylon publish [project folder path]  - Publishes all of your scripts to the Pylon editor, \x1b[1musing 
                                           this command will overwrite your Pylon editor code permanently, so be careful!\x1b[0m
    pylon pull [project folder path]     - Pulls the code of your project from the Pylon editor, \x1b[1musing 
                                           this command will overwrite your locally saved code permanently, so be careful!\x1b[0m
    pylon version                        - Displays Pylon CLI current version
    `)
} else if (args[0] == 'init' || args[0] == 'i') {
    if (args[1] == 'help' || args[1] == '-h' || args[1] == '--help') {
        console.log(`\`pylon init\` - Initiates a new Pylon project locally. You will need to have added Pylon to your server to start using it here.`)
    } else {
        console.log(`
Initiating new project
See \`pylon init help\` for details
        `);

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        console.log('First, name your new project. (Should only contain path-safe characters, no spaces)')
        rl.question('Project name: ', function (name) {
            console.log('\nThis is where it gets kinda weird. Login to https://pylon.bot, open Developer Tools > Storage > Local Storage > https://pylon.bot. \nYou should see a table with a part that says "token". The string next to this is your authentication token.')
            rl.question('Pylon API token:  ', function (token) {
                console.log('\nOpen the script editor of the guild that you\'d like to connect to. At this URL, you should see something like `/deployments/123456789/editor`. \nThis long number is your deployment ID.')
                rl.question('Deployment ID: ', async function (deployment_id) {
                    let names = name.split(' ');
                    name = names[0].trim();
                    
                    // fetch current script
                    let response = await nodeFetch(`https://pylon.bot/api/deployments/${deployment_id}`, {
                        method: 'GET',
                        headers: {
                            Authorization: token
                        },
                    });
                    if (!response.ok) {
                        console.log('Hmm, something went wrong. Probably either your Pylon API token or deployment ID was incorrect.');
                        process.exit();
                    }
                    let editorData = await response.json();

                    console.log(`\n\x1b[34m📂 Found deployment to guild '${editorData.guild.name}'\x1b[0m`)
                    
                    fs.mkdir(`./${name}`, () => {})
                    const configContent = `{
    "name": "${name}", 
    "token": "${token}", 
    "deployment_id": "${deployment_id}"
}`
                    fs.writeFile(`./${name}/config.json`, configContent, 'utf8', () => {});
                    const rollupConfigContent = `// This is the config file for Rollup.js. It is necessary for bundling and publishing to work properly, so don't mess with it if you
// don't know what you're doing.
import typescript from '@rollup/plugin-typescript';

export default {
    input: 'src/main.ts',
    output: {
        file: 'bundle.ts',
        format: 'cjs'
    },
    plugins: [typescript()]
};`;
                    fs.writeFile(`./${name}/rollup.config.js`, rollupConfigContent, 'utf8', () => {});
                    const gitignoreContent = `# Be careful with this: removing the line that ignores the config.json could lead to your Pylon token being exposed if you ever intend to put this project on GitHub.
*/config.json
*/rollup.config.js`;
                    fs.writeFile(`./${name}/.gitignore`, gitignoreContent, 'utf8', () => {});
                    fs.mkdir(`./${name}/src/`, () => {})
                    console.log(`\x1b[32m➕ Created default folders and files`);
                    let project = JSON.parse(editorData.script.project);
                    let files = project.files;
                    for (let i = 0; i < files.length; i++) {
                        let paths = files[i].path.split('/');
                        for (let e = 1; e < paths.length; e++) {
                            function previousPaths(index) {
                                let previousPaths = '';
                                for (let a = 1; a < index; a++) {
                                    previousPaths = `${previousPaths}/${paths[a]}`
                                }
                                return previousPaths;
                            }
                            // if it is a folder path
                            if (e !== (paths.length - 1)) {
                                await fs.mkdir(`./${name}/src/${previousPaths(e)}/${paths[e]}/`, () => {});
                            // if it is a file path
                            } else {
                                if (paths[e].endsWith('.ts')) {
                                    files[i].content = `/// <reference types="@pylonbot/runtime" />
/// <reference types="@pylonbot/runtime-discord" />\n// This states that you are writing code using Pylon types, do not remove.\n\n${files[i].content}`
                                }
                                await fs.writeFile(`./${name}/src${previousPaths(e)}/${paths[e]}`, files[i].content, 'utf8', () => {
                                    if (i == files.length - 1) {
                                        console.log(`\x1b[32m📥 Imported ${files.length} files\x1b[0m`);
                                        exec('npm install rollup typescript @pylonbot/runtime @pylonbot/runtime-discord', (err, stdout, sterr) => {
                                                if (err) {
                                                    console.log(err);
                                                }
                                                console.log(stdout);
                                                console.log(`Installed dependencies`);
                                                return;
                                        });
                                    }
                                });
                            }
                        }
                    }

                    rl.close()
                })
            });
        });
    }
} else if (args[0] == 'publish') {

} else if (args[0] == 'pull') {
    if (args[1] == 'help' || args[1] == '-h' || args[1] == '--help') {
        console.log(`\`pylon pull\` - Pulls . You will need to have added Pylon to your server to start using it here.`)
    } else {
        if (args[1]) {
            let name = args[1];
            let config = require(`./${name}/config.json`);

            // fetch current script
            async function pull() {
                let response = await nodeFetch(`https://pylon.bot/api/deployments/${config.deployment_id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: config.token
                    },
                });
                if (!response.ok) {
                    console.log('Hmm, something went wrong. Probably either your Pylon API token or deployment ID was incorrect.');
                    process.exit();
                } 

                function betterRmdir (path) {
                    if (fs.existsSync(path)) {
                        fs.readdirSync(path).forEach(function (file, index) {
                            var curPath = path + "/" + file;
                            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                                betterRmdir(curPath);
                            } else { // delete file
                                fs.unlinkSync(curPath);
                            }
                        });
                        fs.rmdirSync(path);
                    }
                };

                let editorData = await response.json();
                console.log(`\n\x1b[34m📂 Found deployment to guild '${editorData.guild.name}'\x1b[0m`)
                let project = JSON.parse(editorData.script.project);
                let files = project.files;

                // remove source folder
                betterRmdir(`./${name}/src/`);

                // reimport source folder
                await fs.mkdir(`./${name}/src/`, () => {})

                for (let i = 0; i < files.length; i++) {
                    let paths = files[i].path.split('/');
                    for (let e = 1; e < paths.length; e++) {
                        function previousPaths(index) {
                            let previousPaths = '';
                            for (let a = 1; a < index; a++) {
                                previousPaths = `${previousPaths}/${paths[a]}`
                            }
                            return previousPaths;
                        }
                        // if it is a folder path
                        if (e !== (paths.length - 1)) {
                            await fs.mkdir(`./${name}/src/${previousPaths(e)}/${paths[e]}/`, () => { });
                            // if it is a file path
                        } else {
                            if (paths[e].endsWith('.ts')) {
                                files[i].content = `/// <reference types="@pylonbot/runtime" />
/// <reference types="@pylonbot/runtime-discord" />\n// This states that you are writing code using Pylon types, do not remove.\n\n${files[i].content}`
                            }
                            await fs.writeFile(`./${name}/src${previousPaths(e)}/${paths[e]}`, files[i].content, 'utf8', () => {});
                        }
                    }
                }
                console.log(`\x1b[32m📥 Successfully pulled ${files.length} files\x1b[0m`)
            }

            pull();
        } else {
            console.log('Error: project file path not specified.');
        }
    }
} else if (args[0] == 'version' || args[0] == '-v' || args[0] == '--version') {
    if (args[1] == 'help' || args[1] == '-h' || args[1] == '--help') {
        console.log(`\`pylon version\` - Checks current version of Pylon CLI`)
    } else {
        const version = require('./package.json').version;
        console.log(`v${version}`);
     }
} else {
    console.log('Command not found. Try `pylon help`');
}

function build() {

    exec('rollup -c', (err, stdout, sterr) => {
        if (err) {
            console.log(err);
        }
        console.log(stdout);
        return;
    });
}