'use strict';
var async = require('async')

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

exports.up = function(db, callback) {
  async.series([
    db.createTable.bind(db, "sets", {
      idset: {type: 'int', primaryKey: true, autoIncrement: true},
      title: {type: 'string', length: 30},
      description: {type: 'string', length: 100},
      img_url: 'string',
      deleted: 'timestamp'
  }),
    db.createTable.bind(db, "sounds", {
      idsound: {type: 'int', primaryKey: true, autoIncrement: true},
      set_id: 'int',
      filename: 'string',
      title: {type: 'string', length: 30},
      description: {type: 'string', length: 200},
      img_url: 'string',
      deleted: 'timestamp'
  }),
  db.createTable.bind(db, "loops", {
    idloop: {type: 'int', primaryKey: true, autoIncrement: true},
    set_id: 'int',
    description: {type: 'string', length: 60},
    start: 'real',
    end: 'real',
    deleted: 'timestamp'
  })
  ], callback);
};

exports.down = function(db, callback) {
  async.series([
    db.dropTable.bind(db, 'sets'),
    db.dropTable.bind(db, 'sounds'),
    db.dropTable.bind(db, 'loops')
  ], callback);
};

exports._meta = {
  "version": 1
};
