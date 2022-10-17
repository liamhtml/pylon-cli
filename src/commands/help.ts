import { Command, out, getVersion } from '../utils.js'

const help: Command = (arg) => {
    if (arg) {
        switch (arg) {
            case 'help':
                out('`pylon help` - It\'s a help command. Is that really so hard to figure out?');
                break;
            case 'init':
                out('`pylon init` - Initiates a new Pylon project locally.');
                break;
            case 'publish':
                out('`pylon publish` - Publishes your local code to the Pylon editor and bot. \x1b[1m(This will overwrite all of the files in the Pylon editor\'s filesystem!)\x1b[0m');
                break;
            case 'pull':
                out('`pylon pull` - Pulls your code from the Pylon editor. \x1b[1m(This will overwrite all of the files in your local directory!)\x1b[0m');
                break;
            case 'version':
                out('`pylon version` - Checks package version.`')
                break;
            default:
                out(`'${arg}' is not a command. (See all commands with \`pylon help\`)`, 'error');
        }
    } else {
        out(`Pylon CLI v${getVersion()}
pylon help           - Displays this message
pylon help <command> - Displays more detailed information about a command
pylon init           - Locally creates a new project, grabs the code from the Pylon editor
pylon publish        - Publishes all of your scripts to the Pylon editor, \x1b[1mthis will 
                       overwrite all of the files in the Pylon editor\'s filesystem!\x1b[0m
pylon pull           - Pulls the code of your project from the Pylon editor, \x1b[1mthis will 
                       overwrite all of the files in your local directory!\x1b[0m
pylon version        - Check the package version
        `)
    }
}

export default help;