var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { out } from './utils.js';
import help from './commands/help.js';
// main command handler
export default function cli(args) {
    return __awaiter(this, void 0, void 0, function* () {
        // make sure a command is specified, and otherwise, use help command
        let command = args[0] ? args[0].toLowerCase() : 'help';
        switch (command) {
            case 'help':
                args[1] ? help(args[1].toLowerCase()) : help();
                break;
            default:
                out(`'${command}' is not a command. (See all commands with \`pylon help\`)`, 'error');
                break;
        }
    });
}
