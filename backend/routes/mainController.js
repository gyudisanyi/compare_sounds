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
  Data1 = await queryAsync(`SELECT description, title FROM sets WHERE idsets = ?`, req.params.id);
  Data2 = await queryAsync(`SELECT title, url, description FROM sounds WHERE set_id = ?;`, req.params.id);
  Data3 = await queryAsync(`SELECT loopstart, loopend, description FROM loops WHERE set_id = ?;`, req.params.id);
  Data = {set: {title: Data1[0].title, description: Data1[0].description}, tracks: Data2, loops: Data3};
  res.status(200).json(Data);
})

mainController.get('/sounds/', async (req, res) => {
  Data = await queryAsync(`SELECT * FROM sounds`);

  res.status(200).json(Data);
})

mainController.get('/sounds/:id', async (req, res) => {
  console.log(req.params.id)
  Data = await queryAsync(`SELECT * FROM sounds WHERE idsound = ?`, req.params.id);

  res.status(200).json(Data);
})

mainController.get('/loops', async (req, res) => {
  console.log(req.params.id)
  Data = await queryAsync(`SELECT * FROM sets`);

  res.status(200).json(Data);
})

mainController.get('/loops/:id', async (req, res) => {
  console.log(req.params.id)
  Data = await queryAsync(`SELECT * FROM loops WHERE idloop = ?`, req.params.id);

  res.status(200).json(Data);
})


mainController.post('/:id', async (req, res) => {
  console.log(req);
  response = await queryAsync(`INSERT INTO (id)
   VALUES (?);`, [req.params.id, req.body.name = 'Sanyi', req.body.amount = 123]);
  res.status(200).json(response);
})


module.exports = mainController;