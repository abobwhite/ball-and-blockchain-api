'use strict';
import UsersSvc from '../service/user.svc';

const __baseURI = '/users';

export default class UserRoute {
    constructor(server, mongoProxy) {
        this.server = server;
        this.userSvc = new UsersSvc(mongoProxy);
        this.attachMethods();
    }

    attachMethods() {
        this.server.get(__baseURI, this.getAll);
        this.server.get(__baseURI + '/:id', this.getById);
        this.server.post(__baseURI, this.create);
        this.server.put(__baseURI + '/:id', this.update);
        this.server.del(__baseURI + '/:id', this.delete);
    }

    // GET
    getAll = (req, res, next) => {
      // todo: fetch all users
      // todo: allow for paging?
        this.userSvc.findMany().then(result => {
            res.send(200, result);
        }).catch(err => {
            debugger;
            res.send(422, err.message);
        });
    };

    getById = (req, res, next) => {
      // todo: fetch single user
      res.send(200, {});
    };

    // POST
    create = (req, res, next) => {
      // todo: create
        res.send(201, {});
    };

    // PUT
    update = (req, res, next) => {
      // todo: update
        res.send(200, {});
    };

    // DELETE
    delete = (req, res, next) => {
      // todo: delete
        res.send(204);
    };
}
