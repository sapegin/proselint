# How to contribute

I love pull requests. And following this simple guidelines will make your pull request easier to merge.

## Submitting pull requests

1. Create a new branch, please don’t work in master directly.
2. Add failing tests (if there’re any tests in project) for the change you want to make. Run tests (see below) to see the tests fail.
3. Hack on.
4. Run tests to see if the tests pass. Repeat steps 2–4 until done.
5. Update the documentation to reflect any changes.
6. Push to your fork and submit a pull request.

## JavaScript code style

[See here](https://github.com/tamiadev/eslint-config-tamia#code-style-at-a-glance).

## Other notes

- If you have commit access to repo and want to make big change or not sure about something, make a new branch and open pull request.
- Don’t commit generated files: compiled from Stylus CSS, minified JavaScript, etc.
- Don’t change version number and changelog.
- Install [EditorConfig](http://editorconfig.org/) plugin for your code editor.
- Feel free to [ask me](http://sapegin.me) anything you need.

## Building and running tests

Install dependencies:

```bash
npm install
```

Run tests:

```bash
npm test
```
