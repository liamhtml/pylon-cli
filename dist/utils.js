export function out(message, type) {
    switch (type) {
        case 'success':
            console.log('\x1b[32m' + message + '\x1b[0m');
            break;
        case 'error':
            console.log('\x1b[31m' + message + '\x1b[0m');
            break;
        default:
            console.log(message);
    }
}
