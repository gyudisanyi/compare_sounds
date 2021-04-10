import pkg from 'mysql2';
const { createConnection } = pkg;
import {} from 'dotenv/config.js';

const DB = createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  multipleStatements: true,
});

DB.connect((err) => {
  if (err) {
    console.error('Unable to connect to DB', err.sqlMessage);
    return;
  } console.log('Successfully connected to DB');
});

function queryAsync(sql, queryParameters) {
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