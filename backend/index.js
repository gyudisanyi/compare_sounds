const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const router = require('./routes');
var path = require('path');
const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(router);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Backend server running on port: ${port}`);
});