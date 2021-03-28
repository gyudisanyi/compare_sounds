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
      idsets: {type: 'int', primaryKey: true, autoIncrement: true},
      description: 'string',
      title: 'string'
  }),
    db.createTable.bind(db, "sounds", {
      idsets: {type: 'int', primaryKey: true, autoIncrement: true},
      set_id: 'int',
      filename: 'string',
      description: 'string',
      img_url: 'string'
  }),
  db.createTable.bind(db, "loops", {
    idsets: {type: 'int', primaryKey: true, autoIncrement: true},
    set_id: 'int',
    loopstart: 'real',
    loopend: 'real',
    description: 'string'
  })
  ], callback);
};

exports.down = function(db, callback) {
  async.series([
    db.dropTable.bind(db, 'sets'),
    db.dropTable.bind(db, 'sounds'),
    db.dropTable.bind(db, 'loops'),
    db.dropTable.bind(db, 'owners')
  ], callback);
};

exports._meta = {
  "version": 1
};
