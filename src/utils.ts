import * as dotenv from 'dotenv';

export type Command = (arg?: string) => void;

export function out(message: string, type?: string): void {
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

export function getVersion(): string {
    dotenv.config();
    let version: string = process.env.package_version!;
    return version;
}