import typescript from '@rollup/plugin-typescript';

export default {
    input: 'src/main.ts',
    output: {
        file: 'bundle.ts',
        format: 'cjs'
    },
    plugins: [typescript()]
};