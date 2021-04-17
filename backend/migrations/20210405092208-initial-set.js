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
  queryPromises.push(db.insert('sets', [`idset`, `title`, `description`, `img_url`], [`1`, `Atmosphere set`, `For init`, `cover.JPG`]));
  queryPromises.push(db.insert('sounds', [`set_id`, `title`, `description`, `filename`, `img_url`], [`1`, `Original eq`, `How it sounds`, `5A.mp3`, `slug.JPG`]));
  queryPromises.push(db.insert('sounds', [`set_id`, `title`, `description`, `filename`, `img_url`], [`1`, `Excessive eq`, `Distorted FUBAR`, `5B.mp3`, `ant.JPG`]));
  queryPromises.push(db.insert('loops', [`set_id`, `description`, `start`, `end`], [`1`, `Bass kicks in`, `710`, `800`]));
  
  return Promise.all(queryPromises);
};

exports.down = function(db) {
  const queryPromises = [];
  queryPromises.push(db.runSql("DELETE FROM `sets` WHERE (`idset` = '1')"));
  queryPromises.push(db.runSql("DELETE FROM `sounds` WHERE (`set_id` = '1')"));
  queryPromises.push(db.runSql("DELETE FROM `loops` WHERE (`set_id` = '1')"));
  
  return Promise.all(queryPromises);
};

exports._meta = {
  "version": 1
};
