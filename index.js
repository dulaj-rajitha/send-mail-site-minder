const config = require('./api/config');

const Logger = require('./api/helpers/logger');
const logger = new Logger('App');

const AppServer = require('./api/server');

const appServer = new AppServer();
const port = config.get('/port') || 8080;

appServer.server.listen(port, () => {
    logger.info('Your server is listening on port %d (http://localhost:%d)', port, port);
});
