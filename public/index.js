const electron = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const Store = require('electron-store');
const Jira = require('./jira');
const Rpc = require('./rpc');
const http = require('http-debug').http;

const { app, autoUpdater, dialog, ipcMain, BrowserWindow, Menu, shell } = electron;
const store = new Store();
const jira = new Jira(store);
const rpc = new Rpc(false);

if (isDev) {
  if (false) {
    require('electron-debug')({showDevTools: 'down'});
    http.debug = 2;
  };
}

require('electron-unhandled')();

let mainWindow;

const getUrl = (page) => {
  const route = `#${page}`;
  const url = isDev
    ? `http://localhost:3000/${route}`
    : `file://${path.join(__dirname, '../build/index.html')}${route}`;
  return url;
};

const createMenu = () => {
  const template = [
    {
      label: 'Gistia Tempo',
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    },
    {
      label: 'File',
      submenu: [
        {
          label: 'Debug',
          accelerator: 'CmdOrCtrl+Shift+I',
          click (item, focusedWindow) {
            focusedWindow.webContents.openDevTools();
          },
        },
        {
          label: 'JIRA Credentials...',
          click (_item, _focusedWindow) {
            navigateTo('/auth');
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

const createWindow = () => {
  const { nativeImage } = electron;
  const iconPath = path.join(__dirname, 'icons', 'tempo.icns');
  const icon = nativeImage.createFromPath(iconPath);
  mainWindow = new BrowserWindow({
    title: 'Gistia Tempo',
    width: 800,
    height: 400,
    acceptFirstMouse: true,
    alwaysOnTop: false,
    icon,
  });
  mainWindow.on('closed', () => mainWindow = null);
};

const navigateTo = (route) => {
  mainWindow.loadURL(getUrl(route));
};

const navigateNext = () => {
  const jira = store.get('jira');
  if (!jira) {
    return navigateTo('/auth');
  }
  navigateTo('/timers');
};

const checkForUpdate = () => {
  if (!isDev) {
    const server = 'https://hazel-server-jvjgdmlzmi.now.sh';
    const feed = `${server}/update/${process.platform}/${app.getVersion()}`;

    autoUpdater.setFeedURL(feed);

    setInterval(() => {
      autoUpdater.checkForUpdates();
    }, 60000);

    autoUpdater.checkForUpdates();
  }
};

/**
 * App events
 */

app.on('ready', () => {
  createWindow();
  navigateNext();
  createMenu();
  checkForUpdate();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

/**
 * Auto update events
 */

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: 'A new version has been downloaded. Restart the application to apply the updates.',
  };

  dialog.showMessageBox(dialogOpts, (response) => {
    if (response === 0) autoUpdater.quitAndInstall();
  });
});

autoUpdater.on('error', message => {
  // eslint-disable-next-line no-console
  console.error('There was a problem updating the application');
  // eslint-disable-next-line no-console
  console.error(message);
});

/**
 * IPC Events
 */

ipcMain.on('get', (event, key) => {
  const value = store.get(key);
  // eslint-disable-next-line no-console
  // console.log('getting', key, value);
  event.returnValue = value || null;
});

ipcMain.on('set', (event, data) => {
  const { key, value } = data;
  // eslint-disable-next-line no-console
  // console.log('setting', key, value);
  store.set(key, value);
  event.returnValue = data;
});

ipcMain.on('jira:save', (event, data) => {
  store.set('jira', data);
  jira.getProjects().then(_projects => {
    event.sender.send('jira:save', { success: true });
  }).catch(error => {
    event.sender.send('jira:save', { success: false, error });
  });
});

rpc.subscribe('jira:projects', () => jira.getProjects());
rpc.subscribe('jira:projects:selected', () => jira.getProjects(true));
rpc.subscribe('jira:projects:save', (_, projects) => Promise.resolve(store.set('projects', projects)));
rpc.subscribe('jira:projectDetails', (_, id) => jira.getProjectDetails(id));
rpc.subscribe('jira:issues:search', (_, id) => jira.findIssue(id));
rpc.subscribe('jira:logWork', (_, { id, worklog }) => jira.addWorklog(id, worklog));
rpc.subscribe('jira:assignToMe', (_, { id }) => jira.assignToMe(id));
rpc.subscribe('openLink', (_, url) => Promise.resolve(shell.openExternal(url)));

ipcMain.on('nav', (_, path) => { navigateTo(path); });
ipcMain.on('next', () => navigateNext());

ipcMain.on('window:change', (_, opts) => {
  if (opts.size) {
    mainWindow.setSize(opts.size[0], opts.size[1]);
  }
  if (opts.position) {
    mainWindow.setPosition(opts.position[0], opts.position[1]);
  }
  if (opts.hasOwnProperty('alwaysOnTop')) {
    mainWindow.setAlwaysOnTop(opts.alwaysOnTop);
  }
  if (opts.titleBarStyle) {
    mainWindow.titleBarStyle = opts.titleBarStyle;
  }
});

ipcMain.on('window:getInfo', (event) => {
  event.returnValue = { size: mainWindow.getSize(), position : mainWindow.getPosition() };
});
