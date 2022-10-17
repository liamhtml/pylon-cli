import { out } from './utils.js';
import help from './commands/help.js';
import init from './commands/init.js';
import publish from './commands/publish.js';
import pull from './commands/pull.js';
import version from './commands/version.js';

// main command handler
export default async function cli(args: string[]) {
    // make sure a command is specified, and otherwise, use help command
    let command = args[0] ? args[0].toLowerCase() : 'help';

    switch (command) {
        case 'help':
            args[1] ? help(args[1].toLowerCase()) : help()
            break;
        default: 
            out(`'${command}' is not a command. (See all commands with \`pylon help\`)`, 'error');
            break;
    }
}