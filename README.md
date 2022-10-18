# pylon-cli
A command-line interface for [Pylon.bot](https://pylon.bot), written in TypeScript. <br>
## Setup
1. Set up Pylon (follow the instructions at [Pylon.bot](https://pylon.bot))
2. Once Pylon is on your Discord server, create a new project directory in your editor of choice.
2. Install pylon-cli
```bash
npm i @liamhtml/pylon-cli
# or with yarn:
yarn add @liamhtml/pylon-cli
```
3. Install dependencies for your working environment
You'll need these to code a Pylon bot in your editor - or you'll get a lot of squiggly red lines. They are not *technically* required, but strongly reccommended!
- [TypeScript](https://typescriptlang.org) - a strictly typed superset of JavaScript which Pylon bots are written in.
- [Pylon SDK Types](https://github.com/pylonbot/pylon-sdk-types) - typings for the Pylon SDK. (These gitpkg links are used to link to the GitHub repo because the typings on npm are three years behind)
```bash
npm i --save-dev typescript https://gitpkg.now.sh/pylonbot/pylon-sdk-types/runtime https://gitpkg.now.sh/pylonbot/pylon-sdk-types/runtime-discord
# or with yarn:
yarn add --dev typescript https://gitpkg.now.sh/pylonbot/pylon-sdk-types/runtime https://gitpkg.now.sh/pylonbot/pylon-sdk-types/runtime-discord
```
4. If everything went smoothly, run `pylon init` to link a new discord server.
## Commands

<table>
  <tr>
    <th>Command</th>
    <th>Purpose</th>
  </tr>
  <tr>
    <td><code>pylon help</code></td>
    <td>displays a help message</td>
  </tr>
  <tr>
    <td><code>pylon <command> help</code></td>
    <td>displays more information about a command</td>
  </tr>
  <tr>
    <td><code>pylon init</code></td>
    <td>locally creates a new project, grabs the code from your Pylon online editor, <strong>using this command will overwrite your locally saved code permanently, so be careful!</strong></td>
  </tr>
  <tr>
    <td><code>pylon publish</code></td>
    <td>publishes all of your scripts to the Pylon editor, <strong>using this command will overwrite your Pylon editor code permanently, so be careful!</strong></td>
  </tr>
  <tr>
    <td><code>pylon pull</code></td>
    <td>pulls the code of your project from the Pylon editor, <strong>using this command will overwrite your locally saved code permanently, so be careful!</strong></td>
  </tr>
  <tr>
    <td><code>pylon version</code></td>
    <td>checks the current version of the cli you have installed</td>
  </tr>
</table>

## Dependencies
These are packages which pylon-cli depends on.
- [Tpy](https://github.com/insyri/tpy) - interaction with the Pylon API
- [Rollup](https://rollupjs.org) - bundles files before they are published to Pylon
- [dotenv](https://npmjs.com/dotenv) - niche version numbering