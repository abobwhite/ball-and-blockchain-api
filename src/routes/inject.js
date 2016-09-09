/*jslint node: true, stupid: true */
'use strict';
import fs from 'fs';
import path from 'path';

export default function (server, mongoProxy) {
  const args = arguments;
  console.log(path.resolve(__dirname));
  fs.readdirSync(path.resolve(__dirname)).forEach((file) => {
    // todo: improve check
    if (file.substr(-3, 3) === '.js' && file !== 'inject.js') {

      console.log(file);
      const Route = require('./' + file.replace('.js', '')).default;

      // construct a new Route object with the given arguments dependency injection ;)
      const route = new (Function.prototype.bind.apply(Route, [null, ...args]));

      route.attachMethods();
    }
  });
};
