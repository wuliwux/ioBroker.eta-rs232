![Logo](admin/eta-rs232.png)

# ioBroker.eta-rs232

[![NPM version](http://img.shields.io/npm/v/iobroker.eta-rs232.svg)](https://www.npmjs.com/package/iobroker.eta-rs232)
[![Downloads](https://img.shields.io/npm/dm/iobroker.eta-rs232.svg)](https://www.npmjs.com/package/iobroker.eta-rs232)
![Number of Installations (latest)](http://iobroker.live/badges/eta-rs232-installed.svg)
![Number of Installations (stable)](http://iobroker.live/badges/eta-rs232-stable.svg)
[![Dependency Status](https://img.shields.io/david/wuliwux/iobroker.eta-rs232.svg)](https://david-dm.org/wuliwux/iobroker.eta-rs232)
[![Known Vulnerabilities](https://snyk.io/test/github/wuliwux/ioBroker.eta-rs232/badge.svg)](https://snyk.io/test/github/wuliwux/ioBroker.eta-rs232)

[![NPM](https://nodei.co/npm/iobroker.eta-rs232.png?downloads=true)](https://nodei.co/npm/iobroker.eta-rs232/)

## eta-rs232 adapter for ioBroker

Connect ETA with rs232

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY!!!

## Developer manual

This section is intended for the developer. It can be deleted later

### Scripts in `package.json`

Several npm scripts are predefined for your convenience. You can run them using `npm run <scriptname>`
| Script name | Description |
|-------------|----------------------------------------------------------|
| `build` | Re-compile the TypeScript sources. |
| `watch` | Re-compile the TypeScript sources and watch for changes. |
| `test:ts` | Executes the tests you defined in `*.test.ts` files. |
| `test:package` | Ensures your `package.json` and `io-package.json` are valid. |
| `test:unit` | Tests the adapter startup with unit tests (fast, but might require module mocks to work). |
| `test:integration`| Tests the adapter startup with an actual instance of ioBroker. |
| `test` | Performs a minimal test run on package files and your tests. |
| `lint` | Runs `ESLint` to check your code for formatting errors and potential bugs. |

### Publishing the adapter

To get your adapter released in ioBroker, please refer to the documentation
of [ioBroker.repositories](https://github.com/ioBroker/ioBroker.repositories#requirements-for-adapter-to-get-added-to-the-latest-repository).

### Test the adapter manually on a local ioBroker installation

In order to install the adapter locally without publishing, the following steps are recommended:

1. Create a tarball from your dev directory:
    ```bash
    npm pack
    ```
1. Upload the resulting file to your ioBroker host
1. Install it locally (The paths are different on Windows):
    ```bash
    cd /opt/iobroker
    npm i /path/to/tarball.tgz
    ```

For later updates, the above procedure is not necessary. Just do the following:

1. Overwrite the changed files in the adapter directory (`/opt/iobroker/node_modules/iobroker.eta-rs232`)
1. Execute `iobroker upload eta-rs232` on the ioBroker host

## Changelog

#### 0.5.0 (2020-02-20)

init + inclue compact mode!

### 0.0.1

-   (wuliwux) initial release

## License

MIT License

Copyright (c) 2020 wuliwux <wuliwux@xcore.at>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
