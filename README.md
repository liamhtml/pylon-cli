# pylon-cli
a cli for [pylon](https://pylon.bot) <br>
i am aware that the code is a mess, might change that someday
## installation
```
npm i @liamhtml/pylon-cli
```
## setup
once you have pylon on your discord server, run `pylon init` to get started. 
## commands

<table>
  <tr>
    <th>command</th>
    <th>purpose</th>
    <th>aliases</th>
  </tr>
  <tr>
    <td><code>pylon help</code></td>
    <td>displays a help message</td>
    <td><code>-h, --help</code></td>
  </tr>
  <tr>
    <td><code>pylon <command> help</code></td>
    <td>displays more information about a command</td>
    <td><code>-h, --help</code></td>
  </tr>
  <tr>
    <td><code>pylon init</code></td>
    <td>locally creates a new project, grabs the code from your Pylon online editor, <strong>using this command will overwrite your locally saved code permanently, so be careful!</strong></td>
    <td><code>i</code></td>
  </tr>
  <tr>
    <td><code>pylon publish</code></td>
    <td>publishes all of your scripts to the Pylon editor, <strong>using this command will overwrite your Pylon editor code permanently, so be careful!</strong></td>
    <td><code>p</code></td>
  </tr>
  <tr>
    <td><code>pylon pull</code></td>
    <td>pulls the code of your project from the Pylon editor, <strong>using this command will overwrite your locally saved code permanently, so be careful!</strong></td>
    <td>none</td>
  </tr>
  <tr>
    <td><code>pylon version</code></td>
    <td>checks the current version of the cli you have installed</td>
    <td><code>-v, --version</code></td>
  </tr>
</table>
