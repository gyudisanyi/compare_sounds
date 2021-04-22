import fs from 'fs';
import https from 'https';
import express from 'express';
import cors from 'cors';
import router from './routes/index.js';
import errorHandler from './middlewares/error-handler.js';
const app = express();
const port = 8080;

const privateKey  = fs.readFileSync('./localhost+1-key.pem', 'utf8');
const certificate = fs.readFileSync('./localhost+1.pem', 'utf8');

const credentials = {key: privateKey, cert: certificate};

app.get("*", function (req, res, next) {

  if ("https" !== req.headers["x-forwarded-proto"] && "production" === process.env.NODE_ENV) {
      res.redirect("https://" + req.hostname + req.url);
  } else {
      // Continue to other routes if we're not redirecting
      next();
  }

});

app.use(cors());
app.use(express.json());
app.use(express.static('./public'));

app.use(router);

app.use(errorHandler);

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
  console.log(`Backend server running on port: ${port}`);
});
