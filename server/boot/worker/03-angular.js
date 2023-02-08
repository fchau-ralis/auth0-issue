// Angular require zone-node
require('zone.js/dist/zone-node');
require('@angular/core').enableProdMode();
//Require jsdom
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dom = new JSDOM();
const { Crypto } = require('@peculiar/webcrypto');
// const MockBrowser = require('mock-browser').mocks.MockBrowser;
// const mock = new MockBrowser();

// global['window'] = mock.getWindow();
// global['window'].crypto = new Crypto();
// global['location'] = dom.window.location;

const loopback = require('loopback');
const path = require('path');
const ngExpressEngine = require('@nguniversal/express-engine').ngExpressEngine;
const provideModuleMap = require('@nguniversal/module-map-ngfactory-loader')
    .provideModuleMap;
const PROJECT_DIR = require('../../../settings.js').PROJECT_DIR;

const {
    AppServerModuleNgFactory,
    LAZY_MODULE_MAP,
} = require(`${PROJECT_DIR}/dist/server/main`);

const fs = require('fs');
const domino = require('domino');
// Use the browser index.html as template for the mock window
const template = fs
    .readFileSync(path.join(process.cwd(), 'dist/browser', 'index.html'))
    .toString();

// Shim for the global window and document objects.
const window = domino.createWindow(template);
global['window'] = window;
global['document'] = window.document;
global['window'].crypto = new Crypto();
global['location'] = window.location;
module.exports = app => {
    app.engine(
        'html',
        ngExpressEngine({
            bootstrap: AppServerModuleNgFactory,
            providers: [provideModuleMap(LAZY_MODULE_MAP)],
        })
    );

    app.set('view engine', 'html');
    app.set('views', path.join(PROJECT_DIR, 'dist/browser'));

    // app static files from /browser
    app.get('*.*', loopback.static(path.join(PROJECT_DIR, 'dist/browser')));

    // All regular routes use the Universal engine
    app.get('/*', require(`${PROJECT_DIR}/server/middleware/spa`));
};
