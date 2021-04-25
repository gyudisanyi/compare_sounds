import pkg from 'mysql2';
const { createPool } = pkg;
import {} from 'dotenv/config.js';

const DB = createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  connectionLimit: 10,
  multipleStatements: true,
  authSwitchHandler: function ({pluginName, pluginData}, cb) {
    if (pluginName === 'ssh-key-auth') {
      getPrivateKey(key => {
        const response = encrypt(key, pluginData);
        // continue handshake by sending response data
        // respond with error to propagate error to connect/changeUser handlers
        cb(null, response);
      });
    } else {
      const err = new Error(`Unknown AuthSwitchRequest plugin name ${pluginName}`);
      err.fatal = true;
      cb(err);
    }
  }
});

DB.getConnection((err) => {
  if (err) {
    console.error('Unable to connect to DB pool', err.sqlMessage);
    return;
  } console.log('Successfully connected to DB pool');
});


async function queryAsync(sql, queryParameters) {

  return new Promise((resolve, reject) => {
    DB.query(sql, queryParameters, (error, result) => {
      if (error) {
        reject(error); // error
        return;
      }
      resolve(result); // success
    });
  });
}

export default queryAsync;