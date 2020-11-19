# proselint

[![npm](https://img.shields.io/npm/v/proselint.svg)](https://www.npmjs.com/package/proselint) [![Build Status](https://travis-ci.org/sapegin/proselint.svg)](https://travis-ci.org/sapegin/proselint)

[Proselint](http://proselint.com/) wrapper with a friendly reporter. Also skips text in Markdown code blocks.

![Proselint](https://d3vv6lp55qjaqc.cloudfront.net/items/3i3x3B143E1r3g0i0W3R/proselint.png)

## Installation

### macOS

```bash
brew install proselint
npm install -g proselint
```

### Other platforms

```bash
pip install proselint
npm install -g proselint
```

## Usage

```bash
proselintjs filename.md
proselintjs *.md
proselintjs 'pattern/**/*.md'
```

## Configuration

You can disable any rule in `~/.proselintrc`:

```json
{
  "checks": {
    "typography.diacritical_marks": false
  }
}
```

See the original [proselint docs](https://github.com/amperser/proselint/#checks) for more details.

## Changelog

The changelog can be found on the [Releases page](https://github.com/sapegin/proselint/releases).

## Contributing

Everyone is welcome to contribute. Please take a moment to review the [contributing guidelines](Contributing.md).

## Authors and license

[Artem Sapegin](https://sapegin.me) and [contributors](https://github.com/sapegin/proselint/graphs/contributors).

MIT License, see the included [License.md](License.md) file.
