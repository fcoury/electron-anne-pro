class Rpc {
  constructor(client) {
    this.client = !!client;
    if (this.client) {
      const { ipcRenderer } = window.require('electron');
      this.interface = ipcRenderer;
    } else {
      const { ipcMain } = require('electron');
      this.interface = ipcMain;
    }
  }

  subscribe(eventName, callback) {
    this.interface.on(eventName, (event, data) => {
      const target = event.sender;
      return callback(event, data)
        .then(data => target.send(eventName, { success: true, data }))
        .catch(error => target.send(eventName, { success: false, error }));
    });
  }

  on(event, callback) {
    this.interface.on(event, callback);
  }

  send(event, data) {
    this.interface.send(event, data);
  }

  sendSync(event, data) {
    this.interface.sendSync(event, data);
  }

  call(event, callback) {
    this.callWithData(event, null, callback);
  }

  callWithData(event, data, callback) {
    if (callback) {
      this.interface.once(event, callback);
    }
    this.interface.send(event, data);
  }
}

module.exports = Rpc;
