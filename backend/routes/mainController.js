import express from 'express';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import queryAsync from '../database.js';
const mainController = express.Router();
let status = 200;
let Data;

mainController.delete('/sets/:id', async (req, res) => {
try{
  Data = await queryAsync(`UPDATE sets SET deleted=NOW() WHERE idset=?`, req.params.id);
  } catch(err) {
  status=500;
  Data=err;
  }
  res.status(status).json(Data);
})

mainController.get('/', async (req, res) => {
  let Data;
  try {
    Data = await queryAsync(`SELECT idset AS id, description, title FROM sets WHERE deleted IS NULL`);
  } catch (err) {
    status = 500;
    Data = err;
  }
  res.status(status).json(Data);
})

mainController.get('/sets', async (req, res) => {
  let Data;
  try {
    Data = await queryAsync(`SELECT idset AS id, description, title FROM sets WHERE deleted IS NULL`);
  } catch (err) {
    status = 500;
    Data = err;
  }
  res.status(status).json(Data);
})

mainController.get('/sets/:id', async (req, res) => {
  let Data1, Data2, Data3;
  try {
    Data1 = await queryAsync(`SELECT idset AS id, description, title FROM sets WHERE idset = ? AND deleted IS NULL`, req.params.id);
    Data2 = await queryAsync(`SELECT idsound AS id, title, filename, description, img_url FROM sounds WHERE set_id = ? AND deleted IS NULL;`, req.params.id);
    Data3 = await queryAsync(`SELECT idloop AS id, start, end, description FROM loops WHERE set_id = ? AND deleted IS NULL;`, req.params.id);
    Data = { set: Data1[0], tracks: Data2, loops: Data3 };
  } catch (err) {
    console.log(err);
    status = 500;
    Data = err;
  }
  res.status(status).json(Data);
})

mainController.get('/sounds/', async (req, res) => {

  try {
    Data = await queryAsync(`SELECT * FROM sounds`);
  } catch (err) {
    console.log(err);
    status = 500;
    Data = err;
  }
  res.status(status).json(Data);
})

mainController.get('/sounds/:id', async (req, res) => {
  try {
    Data = await queryAsync(`SELECT * FROM sounds WHERE idsound = ?`, req.params.id);
  } catch (err) {
    console.log(err);
    status = 500;
    Data = err;
  }
  res.status(status).json(Data);
})

mainController.get('/loops', async (req, res) => {
  try {
    Data = await queryAsync(`SELECT * FROM loops`);
  } catch (err) {
    console.log(err);
    status = 500;
    Data = err;
  }
  res.status(status).json(Data);
})

mainController.get('/loops/:id', async (req, res) => {
  try {
    Data = await queryAsync(`SELECT * FROM loops WHERE idloop = ?`, req.params.id);
  } catch (err) {
    console.log(err);
    status = 500;
    Data = err;
  }
  res.status(status).json(Data);
})

mainController.post('/sets/new', async (req, res) => {
  try {
    Data = await queryAsync(`INSERT INTO sets (title, description) VALUES ('Empty set', 'Add description');`)
    let uploadPath = `./public/audio_src/${Data.insertId}/img`;
    await fsPromises.mkdir(uploadPath, { recursive: true });
  } catch (err) {
    status = 500;
  }
  res.status(status).json(Data);
})

mainController.patch('/sets/:id', async ({ files, body, params }, res) => {

  console.log({ files }, { body }, { params });
  
  
  let Data;
  try {
    
    if (files) {
      if (!Array.isArray(files.File)) {files.File=[files.File]}
      uploadPath = __dirname + `./../public/audio_src/${params.id}/`;
      console.log(uploadPath);
      files.File.forEach((file) => {
        file.mv(uploadPath + file.name, function (err) {
          if (err)
            throw (err);
        })
      })
      if (!Array.isArray(body.Tracktitles)) {body.Tracktitles=[body.Tracktitles]}
      if (!Array.isArray(body.Trackdescriptions)) {body.Trackdescriptions=[body.Trackdescriptions]}
      let titles = files.File.map((file, i) => body.Tracktitles[i] || file.name);
      let descriptions = files.File.map((file, i) => body.Trackdescriptions[i] || "Add description");
      console.log("HEY", titles, descriptions);
      let insertQuery = `INSERT INTO sounds (title, filename, description, set_id) VALUES (?, ?, ?, ?);`;
      Data += Promise.all(titles.map((t, i) =>
        new Promise((resolve, reject) =>
          queryAsync(insertQuery, [t, files.File[i].name, descriptions[i], params.id])
        )
      ));

    }

    Data += await queryAsync(`UPDATE sets SET title=?, description=? WHERE idset = ?;`, [body.Title || "unnamed", body.Description || "undescribed", params.id]);

    if (body.AlteredTitles) {
      if (!Array.isArray(body.OldTrackTitles)) {body.OldTrackTitles=[body.OldTrackTitles]}
      const updateTitle = `UPDATE sounds SET title=? WHERE idsound=?`;
      const AlteredTitles = body.AlteredTitles.split(',');
      Data += Promise.all(AlteredTitles.map((t, i) =>
        new Promise((resolve, reject) =>
          queryAsync(updateTitle, [body.OldTrackTitles[i], t])
        )
      ));
    }

    if (body.AlteredDescriptions) {
      const updateDescription = `UPDATE sounds SET description=? WHERE idsound=?`;
      const AlteredDescriptions = body.AlteredDescriptions.split(',');
      Data += Promise.all(AlteredDescriptions.map((t, i) =>
        new Promise((resolve, reject) =>
          queryAsync(updateDescription, [typeof body.OldTrackDescriptions == 'string' ? body.OldTrackDescriptions : body.OldTrackDescriptions[i], t])
        )
      ));
    }

    if (body.ToDelete) {
      const del = body.ToDelete.split(',');
      Data += queryAsync(`UPDATE sounds SET deleted=NOW() WHERE idsound IN (?${',?'.repeat(del.length - 1)})`, del);
    }

  } catch (err) {
    status = 500;
    Data = err;
  }
  console.log(status, Data)
  res.status(status).send(Data);
})

export default mainController;
