const path = require('node:path');
const { app } = require('electron');
const i18next = require("i18next");
const i18next_fs_backend = require("i18next-fs-backend");

async function initI18n() {
    if(!app.isReady()) {
        throw new Error("Electron app not ready");
    }

    await i18next.use(i18next_fs_backend).init({
        backend: {
            // path where resources get loaded from, or a function
            // returning a path:
            // function(lngs, namespaces) { return customPath; }
            // the returned path will interpolate lng, ns if provided like giving a static path
            loadPath: path.join(__dirname, 'locales', "{{lng}}.json"),

            // path to post missing resources
            addPath: './locales/{{lng}}.missing.json',

            // if you use i18next-fs-backend as caching layer in combination with i18next-chained-backend, you can optionally set an expiration time
            // an example on how to use it as cache layer can be found here: https://github.com/i18next/i18next-fs-backend/blob/master/example/caching/app.js
            // expirationTime: 60 * 60 * 1000
        },
        lng: app.getLocale(), // if you're using a language detector, do not define the lng option
        fallbackLng: 'en',
        debug: true,
    });
};

module.exports = { initI18n, i18next };