const express = require('express');
const { fs } = require('fs');
const fsPromises = require('fs').promises;
const queryAsync = require('../database');
const mainController = express.Router();

mainController.post('/md/:id', async ({params}, res) => {
  let status = 200;
  let reply = "oi";
  let uploadPath = __dirname + `./../public/audio_src/${params.id}/`;
  try {
  reply = await fsPromises.mkdir(uploadPath, {recursive: true});
  } catch(err){
    status = 500;
  }
  res.status(status).json(reply);
})

mainController.get('/', async (req, res) => {
  Data = await queryAsync(`SELECT idset AS id, description, title FROM sets WHERE deleted IS NULL`);

  res.status(200).json(Data);
})

mainController.get('/sets', async (req, res) => {
  Data = await queryAsync(`SELECT idset AS id, description, title FROM sets WHERE deleted IS NULL`);

  res.status(200).json(Data);
})

mainController.get('/sets/:id', async (req, res) => {
  const status = 200;
  try {
    Data1 = await queryAsync(`SELECT idset AS id, description, title FROM sets WHERE idset = ? AND deleted IS NULL`, req.params.id);
    Data2 = await queryAsync(`SELECT idsound AS id, title, filename, description, img_url FROM sounds WHERE set_id = ? AND deleted IS NULL;`, req.params.id);
    Data3 = await queryAsync(`SELECT idloop AS id, start, end, description FROM loops WHERE set_id = ? AND deleted IS NULL;`, req.params.id);
    if (Data1.length == 0 ) {throw new Error(`No such set`)};
    console.log({Data1})
    //if (Data2.length == 0 ) {throw new Error(`Empty set`)};
    Data = {set: Data1[0], tracks: Data2, loops: Data3};
  } catch(err) {
    console.log(err);
    status = 500;
    Data = err;
  }
    res.status(status).json(Data);
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

mainController.post('/sets/new', async (req, res) => {
  const status = 200;
  const Data = await queryAsync(`INSERT INTO sets (title, description) VALUES ('Empty set', 'Add description');`)
  console.log(Data.insertId);
  let uploadPath = __dirname + `./../public/audio_src/${Data.insertId}/`;
  try {
  reply = await fsPromises.mkdir(uploadPath, {recursive: true});
  } catch(err){
    status = 500;
  }
  res.status(status).json(Data);
})

mainController.post('/sets/:id', async ({files, body, params}, res) => {
  console.log(files.File);
  console.log(body.Description);
  files.File.forEach((file) => {
    uploadPath = __dirname + `./../public/audio_src/${params.id}/` + file.name;
    console.log(uploadPath);
    file.mv(uploadPath, function(err) {
      if (err)
      console.log(err);
    })
  })
  let query = `INSERT INTO sounds (title, filename, description, set_id) VALUES (?, ?, ?, ?);`;
  let response = Promise.all(body.Description.map((d, i) => new Promise((resolve, reject) => queryAsync(query, [d, files.File[i].name, d, params.id]))));
  console.log(response);
  res.status(200).send(response);
})

mainController.patch('/sets/:id', async ({files, body, params}, res) => {
  console.log({body}, {params});

  if (files) {
    uploadPath = __dirname + `./../public/audio_src/${params.id}/`;
    console.log(uploadPath);
    files.File.forEach((file) => {
    file.mv(uploadPath+file.name, function(err) {
      if (err)
      console.log(err);
    })
  })}

  await queryAsync(`UPDATE sets SET title=?, description=? WHERE idset = ?;`, [body.Title || "unnamed", body.Description || "undescribed", params.id]);
  
  if (files && body.Tracktitles) {
    let insertQuery = `INSERT INTO sounds (title, filename, description, set_id) VALUES (?, ?, ?, ?);`;
    let response = Promise.all(body.Tracktitles.map((t, i) =>
      new Promise((resolve, reject) =>
        queryAsync(insertQuery, [t, files.File[i].name, body.Trackdescriptions[i], params.id])
      )
    ));
  }
  
  
  if (body.AlteredTitles) {
    const updateTitle = `UPDATE sounds SET title=? WHERE idsound=?`;
    const AlteredTitles = body.AlteredTitles.split(',');
    let response = Promise.all(AlteredTitles.map((t, i) =>
      new Promise((resolve, reject) =>
        queryAsync(updateTitle, [body.OldTrackTitles[i], t])
      )
    ));
  }

  
  if (body.AlteredDescriptions) {
    const updateDescription = `UPDATE sounds SET description=? WHERE idsound=?`;
    const AlteredDescriptions = body.AlteredDescriptions.split(',');
    console.log(AlteredDescriptions);
    let response = Promise.all(AlteredDescriptions.map((t, i) =>
      new Promise((resolve, reject) =>
        queryAsync(updateDescription, [typeof body.OldTrackDescriptions == 'string'? body.OldTrackDescriptions : body.OldTrackDescriptions[i], t])
      )
    ));
  }

  if (body.ToDelete) {
  const del = body.ToDelete.split(',');
  await queryAsync(`UPDATE sounds SET deleted=NOW() WHERE idsound IN (?${',?'.repeat(del.length-1)})`, del);
  }

  res.status(200).send();
})

mainController.delete('/sounds', async({body}, res) => {
  let toDelete = body.todelete.split(',');
  let query = `UPDATE sounds SET deleted = NOW() WHERE (idsound = ?);`
  let response = Promise.all(toDelete.map((s) => new Promise((resolve, reject) => queryAsync(query, [s]))));
  console.log({response});
  res.status(200).json(response);
})


module.exports = mainController;