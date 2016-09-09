'use strict';
import {default as People} from '../../eth/build/contracts/People.sol';

const peopleContract = People.deployed();

export default class UsersSvc {
  constructor(mongoProxy, ETHEREUM_CLIENT) {
    this.mongoProxy = mongoProxy;
    this.ETHEREUM_CLIENT = ETHEREUM_CLIENT;
  }

  findById(id) {
    return {};
  }

  findByUsername(username) {
      return {};
  }

  findMany() {
    return new Promise((resolve, reject)=>{
      peopleContract.getPeople().then(resolve).catch(reject);
    });
  }

  create(user) {
    return {};
  }

  update(user) {
    return {};
  }

  remove(id) {
  }
}
