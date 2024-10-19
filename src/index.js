const {
  app,
  BrowserWindow,
  Menu,
  MessageChannelMain,
  nativeImage,
  shell,
  Tray,
  utilityProcess,
} = require('electron');
const path = require('node:path');

let tray;
let child;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

const createTray = () => {
  if (!tray) {
    const icon = nativeImage.createFromPath(path.join(__dirname, 'assets', 'icons', 'transparent.png'));
    tray = new Tray(icon);

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show Chart',
        click: () => {
          shell.openExternal("https://energy-charts.info/charts/consumption_advice/chart.htm?l=de&c=DE")
        }
      },
      {
        label: 'Quit',
        click: () => {
          app.quit() // actually quit the app.
        }
      },
    ])

    tray.setToolTip('Loading…');
    tray.setContextMenu(contextMenu);
  }
};

function startBackgroundRefresh() {
  child = utilityProcess.fork(path.join(__dirname, 'energy-charts.js'))

  child.on('message', (x) => {
    const now = Date.now() / 1000;
    let i;
    for(i = 0; i < x.unix_seconds.length; i++) {
      if(x.unix_seconds[i] > now) {
        break;
      }
    }

    let iconName = 'transparent.png';
    switch (x.signal[i]) {
      case -1:
      case 0:
        iconName = 'red.png';
        break;
      case 1:
        iconName = 'yellow.png';
        break;
      case 2:
        iconName = 'green.png';
        break;
      default:
        break;
    }
    const icon = nativeImage.createFromPath(path.join(__dirname, 'assets', 'icons', iconName));
    tray.setImage(icon);

    tray.setToolTip(x.share[i] + "% share of renewables");
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  if (process.platform === 'darwin') {
    app.dock.hide();
  }

  createTray();
  startBackgroundRefresh();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    // if (BrowserWindow.getAllWindows().length === 0) {
    //   createWindow();
    // }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
