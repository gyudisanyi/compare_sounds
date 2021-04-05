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

  queryPromises.push(db.createTable("sets", {
      idset: {type: 'int', primaryKey: true, autoIncrement: true},
      title: {type: 'string', length: 50},
      description: {type: 'string', length: 250},
      img_url: 'string',
      deleted: 'timestamp'
  }));
    queryPromises.push(db.createTable("sounds", {
      idsound: {type: 'int', primaryKey: true, autoIncrement: true},
      set_id: 'int',
      filename: 'string',
      title: {type: 'string', length: 50},
      description: {type: 'string', length: 250},
      img_url: 'string',
      deleted: 'timestamp'
  }));
    queryPromises.push(db.createTable("loops", {
      idloop: {type: 'int', primaryKey: true, autoIncrement: true},
      set_id: 'int',
      description: {type: 'string', length: 30},
      start: 'real',
      end: 'real',
      deleted: 'timestamp'
  }));

  return Promise.all(queryPromises);

};

exports.down = function(db) {

  const queryPromises = [];
    queryPromises.push(db.dropTable('sets'));
    queryPromises.push(db.dropTable('sounds'));
    queryPromises.push(db.dropTable('loops'));

  return Promise.all(queryPromises);
};

exports._meta = {
  "version": 1
};
