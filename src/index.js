const path = require('node:path');
const {
    app,
    BrowserWindow,
    Menu,
    nativeImage,
    shell,
    Tray,
    MenuItem,
} = require('electron');
const { logger } = require('./logger');
const { initI18n, i18n, i18next } = require('./i18n');
const { EnergyChartsService } = require('./grid-data-service/energy-charts');

let tray;
let mainWindow;
let stickyChartCheckbox;
let showWindow = false;
let lastGridData;
let gridService;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 400,
        height: 200,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
        frame: false,
        show: false,
        alwaysOnTop: true,
    });
    mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
    mainWindow.webContents.on('input-event', (e, inputEvent) => {
        if (inputEvent.type == 'mouseMove') {
            showWindow = true;
        }
        if (inputEvent.type == 'mouseLeave') {
            showWindow = false;
            setTimeout(() => {
                if (stickyChartCheckbox.checked) {
                    return;
                }
                if (showWindow) {
                    return;
                }
                mainWindow.hide();
            }, 50);
        }
    });
    mainWindow.webContents.on('dom-ready', () => {
        mainWindow.webContents.send('updateBaseGridData', lastGridData);
    });
};

const createTray = () => {
    if (!tray) {
        const icon = nativeImage.createFromPath(path.join(__dirname, 'assets', 'icons', 'transparent.png'));
        tray = new Tray(icon);

        stickyChartCheckbox = new MenuItem({
            label: i18next.t('tray.devTools.alwaysShow'),
            type: 'checkbox',
            click: () => {
                logger.info("Checked " + stickyChartCheckbox.checked);
            },
            checked: false,
        });
        const contextMenu = Menu.buildFromTemplate([
            {
                label: i18next.t('tray.openEnergyCharts'),
                click: () => {
                    shell.openExternal("https://energy-charts.info/charts/power/chart.htm?l=de&c=DE")
                }
            },
            { type: 'separator', },
            {
                label: i18next.t('tray.devTools.devTools'),
                submenu: [
                    stickyChartCheckbox,
                    {
                        label: i18next.t('tray.devTools.chromeDevTools'),
                        click: () => {
                            // Open the DevTools.
                            mainWindow.webContents.openDevTools({ mode: 'detach' });
                        }
                    },
                    {
                        label: i18next.t('tray.devTools.refresh'),
                        click: () => {
                            mainWindow.webContents.reload();
                            gridService.update();
                        }
                    }
                ]
            },
            { type: 'separator', },
            {
                label: i18next.t('tray.about'),
                click: () => {
                    shell.openExternal("https://github.com/vsaw/grid-at-a-glance")
                }
            },
            {
                label: i18next.t('tray.quit'),
                role: 'quit',
                click: () => {
                    app.quit() // actually quit the app.
                }
            },
        ])

        tray.setToolTip('Loading…');
        tray.setContextMenu(contextMenu);
        tray.on('mouse-enter', () => {
            showWindow = true;
            if (mainWindow.isVisible()) {
                return;
            }
            const bounds = tray.getBounds();
            mainWindow.setPosition(bounds.x, bounds.y + bounds.height);
            mainWindow.showInactive();
        });
        tray.on('mouse-leave', () => {
            showWindow = false;
            setTimeout(() => {
                if (stickyChartCheckbox.checked) {
                    return;
                }
                if (showWindow) {
                    return;
                }

                if(mainWindow.isDestroyed()) {
                    return;
                }
                mainWindow.hide();
            }, 50);
        });
    }
};

function startBackgroundRefresh() {
    gridService = new EnergyChartsService();
    gridService.on('gridData', (data) => {
        logger.info({ trafficLight: data.gridDataNow.trafficLight }, 'data event');

        // Update Tray Icon
        updateTrayIcon(data.gridDataNow.trafficLight);
        lastGridData = data;
        if(!mainWindow.isDestroyed()) {
            logger.info(lastGridData.gridDataNow.timestamp, "updateBaseGridData - startBackgroundRefresh");
            mainWindow.webContents.send('updateBaseGridData', data);
        }
    });

    function updateTrayIcon(trafficLight) {
        let iconName = 'transparent.png';
        switch (trafficLight) {
            case "RED":
                iconName = 'red.png';
                break;
            case "YELLOW":
                iconName = 'yellow.png';
                break;
            case "GREEN":
                iconName = 'green.png';
                break;
            default:
                break;
        }
        const icon = nativeImage.createFromPath(path.join(__dirname, 'assets', 'icons', iconName));
        tray.setImage(icon);
        tray.setToolTip("");
        mainWindow.reload();
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (process.platform === 'darwin') {
        app.dock.hide();
    }

    await initI18n();
    createWindow();
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
