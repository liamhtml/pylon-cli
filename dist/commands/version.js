import { out, getVersion } from '../utils.js';
const version = () => {
    out(`v${getVersion()}`);
};
export default version;
