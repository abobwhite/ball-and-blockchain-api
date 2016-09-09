/*jslint node: true, indent: 2 */
'use strict';
import restify from 'restify';
import bunyan  from 'bunyan';
import {default as routes} from './routes/inject';
import MongoProxy from './proxy/mongoProxy';
import CONFIG from '../config.json';

// CREATE LOGGER
const log = bunyan.createLogger({
  name        : 'dbs-angular-exercises-server',
  level       : process.env.LOG_LEVEL || 'info',
  stream      : process.stdout,
  serializers : bunyan.stdSerializers
});

// CREATE SERVER
// todo: add a socket server here
const server = restify.createServer({
  name : 'dbs-angular-exercises-server',
  log  : log,
  formatters : {
    'application/json' : function (req, res, body, cb) {
      res.setHeader('Cache-Control', 'must-revalidate');

      // Does the client *explicitly* accepts application/json?
      var sendPlainText = (req.header('Accept').split(/, */).indexOf('application/json') === -1);

      // Send as plain text
      if (sendPlainText) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      }

      // Send as JSON
      if (!sendPlainText) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
      }
      return cb(null, JSON.stringify(body));
    }
  }
});

server.use(restify.bodyParser({ mapParams: false }));
server.use(restify.queryParser());
server.use(restify.gzipResponse());
server.pre(restify.pre.sanitizePath());

/*jslint unparam:true*/
// Default error handler. Personalize according to your needs.
server.on('uncaughtException', function (req, res, route, err) {
  console.log('******* Begin Error *******');
  console.log(route);
  console.log('*******');
  console.log(err.stack);
  console.log('******* End Error *******');
  if (!res.headersSent) {
    return res.send(500, { ok : false });
  }
  res.write("\n");
  res.end();
});
/*jslint unparam:false*/

server.on('after', restify.auditLogger({ log: log }));

// CREATE MONGO PROXY
let monogUrl = !!process.env.MONGO_URL ? process.env.MONGO_URL : CONFIG.mongo.url;
const mongoProxy = new MongoProxy(monogUrl + CONFIG.mongo.name);

// INJECT ROUTES
routes(server, mongoProxy);

console.log('Server started.');
server.listen(8080, function () {
  log.info('%s listening at %s', server.name, server.url);
});

