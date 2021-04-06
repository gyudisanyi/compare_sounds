'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {

  const queryPromises = [];

  queryPromises.push(db.createTable("users", {
    iduser: {type: 'int', primaryKey: true, autoIncrement: true},
    username: {type: 'string', length: 50},
    password_hash: {type: 'string', length: 250},
  }));
  queryPromises.push(db.addColumn("sets", "user_id", {
    type: 'int'
  }));
  queryPromises.push(db.addColumn("sounds", "user_id", {
    type: 'int'
  }));
  queryPromises.push(db.addColumn("loops", "user_id", {
    type: 'int'
  }));
  
  return Promise.all(queryPromises);

};

exports.down = function(db) {
  const queryPromises = []

  queryPromises.push(db.removeColumn("sets", "user_id"));
  queryPromises.push(db.removeColumn("sounds", "user_id"));
  queryPromises.push(db.removeColumn("loops", "user_id"));
  queryPromises.push(db.dropTable("users"));

  return Promise.all(queryPromises);
};

exports._meta = {
  "version": 1
};
