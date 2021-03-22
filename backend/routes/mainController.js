const express = require('express');
const queryAsync = require('../database');
const mainController = express.Router();

mainController.get('/', (req, res) => {
  let sqlQuery = "SELECT * FROM `1`"
  queryAsync(sqlQuery)
    .then((response) => res.status(200).json(response))
    .catch((error) => {
      res.status(500).json({
        "errorMessage": error.sqlMessage
      });
    });
});

mainController.get('/sets', async (req, res) => {
  Data = await queryAsync(`SELECT * FROM sets`);

  res.status(200).json(Data);
})

mainController.get('/sets/:id', async (req, res) => {
  Data = await queryAsync(`SELECT sounds.*, sets.title AS set_title FROM sounds JOIN sets ON set_id=idsets WHERE set_id=?;`, req.params.id);

  res.status(200).json(Data);
})

mainController.get('/sounds/', async (req, res) => {
  Data = await queryAsync(`SELECT * FROM sounds`);

  res.status(200).json(Data);
})

mainController.get('/sounds/:id', async (req, res) => {
  console.log(req.params.id)
  Data = await queryAsync(`SELECT * FROM sounds WHERE idsounds = ?`, req.params.id);

  res.status(200).json(Data);
})

mainController.get('/loops', async (req, res) => {
  console.log(req.params.id)
  Data = await queryAsync(`SELECT * FROM sets`);

  res.status(200).json(Data);
})

mainController.get('/loops/:id', async (req, res) => {
  console.log(req.params.id)
  Data = await queryAsync(`SELECT * FROM loops WHERE idloops = ?`, req.params.id);

  res.status(200).json(Data);
})


mainController.post('/:id', async (req, res) => {
  console.log(req);
  response = await queryAsync(`INSERT INTO (id)
   VALUES (?);`, [req.params.id, req.body.name = 'Sanyi', req.body.amount = 123]);
  res.status(200).json(response);
})


module.exports = mainController;