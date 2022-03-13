[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Release](https://img.shields.io/github/release/emacs-eask/setup-eask.svg?logo=github)](https://github.com/emacs-eask/setup-eask/releases/latest)

# setup-eask
> Install Eask for Github Actions workflow

[![CI](https://github.com/emacs-eask/setup-eask/actions/workflows/test.yml/badge.svg)](https://github.com/emacs-eask/setup-eask/actions/workflows/test.yml)

## 🔨 Usage

```yml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v1
      with:
        node-version: 12.x

    - uses: purcell/setup-emacs@master
      with:
        version: '27.2'

    - uses: emacs-eask/setup-eask@master
      with:
        version: 'snapshot'

    - name: Run tests
      run: make test
```

This example is testing your package in below environment.

* Emacs: `27.2`
* Node: `12.x`
* Eask: `snapshot` (latest)

## License

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
