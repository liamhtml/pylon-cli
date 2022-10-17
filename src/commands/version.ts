import { Command, out, getVersion } from '../utils.js'

const version: Command = () => {
    out(`v${getVersion()}`);
}

export default version;