# Grid at a glance

A tray icon showing information about the electrical grid at real time

![Demo](./docs/Demo.gif)

The Data is taken from https://energy-charts.info via their public API.

## Features

- Shows the current share of renewable electricity in the German grid
  - 🟢 >60%
  - 🟡 40% - 60%
  - 🔴 <40%
  - ⚪️ Loading…
- Tooltip shows exact number on hover
- Shortcut to https://energy-charts.info to show full chart of past and future shares of renewables
- Refreshes automatically in the background

## Development

Grid at a glance is built on [ElectronJS](https://www.electronjs.org/).

Currently only tested under macOS, but should be working other platforms.

## License

Code shared under [MIT](License.md), except for icons under `src/assets/icons` which are based on [OpenMoji](https://openmoji.org/library/emoji-26A1/#variant=black) and under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).