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

  queryPromises.push(db.addColumn("sets", "published", {
    type: 'timestamp'
  }));
  queryPromises.push(db.addColumn("sounds", "duration", {
    type: 'real'
  }));
  queryPromises.push(db.runSql('UPDATE sets SET published=NOW() WHERE idset=1'));
  queryPromises.push(db.runSql('UPDATE sounds SET duration=14 WHERE set_id=1'));

  return Promise.all(queryPromises);

};

exports.down = function(db) {
  
  const queryPromises = [];

  queryPromises.push(db.removeColumn("sets", "published"));
  queryPromises.push(db.removeColumn("sounds", "duration"));
  
  return Promise.all(queryPromises);
};

exports._meta = {
  "version": 1
};
