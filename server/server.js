'use strict';

require('dotenv').config();
const loopback = require('loopback');
const boot = require('loopback-boot');
const throng = require('throng');
let sslRedirect = require('heroku-ssl-redirect');

// establish the number of process based off environment variable config,
// cpus, or default 1
const workers = process.env.WEB_CONCURRENCY || require('os').cpus().length || 1;

const app = (module.exports = loopback());

// enable ssl redirect
if (process.env.NODE_ENV == 'production') {
    app.use(sslRedirect());
}
app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);

app.start = () => {
    // start the web app
    return app.listen(() => {
        app.emit('started');
        const baseUrl = app.get('url').replace(/\/$/, '');
        console.log(`Web app listening at: ${baseUrl}`);
        if (app.get('loopback-component-explorer')) {
            const explorerPath = app.get('loopback-component-explorer')
                .mountPath;
            console.log(`Browse your REST API at ${baseUrl}${explorerPath}`);
        }
    });
};

const master = () => {
    const bootOptions = {
        appRootDir: __dirname,
        bootDirs: ['boot/master'],
    };
    boot(app, bootOptions, err => {
        if (err) throw err;
    });
};

const worker = () => {
    const bootOptions = {
        appRootDir: __dirname,
        bootDirs: ['boot/worker'],
    };
    boot(app, bootOptions, err => {
        if (err) throw err;

        if (require.main === module) app.start();
    });
};

throng({
    workers: workers,
    master: master,
    start: worker,
    lifetime: Infinity,
});
