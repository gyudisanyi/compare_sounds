import express from 'express';
import cors from 'cors';
import router from './routes/index.js';
import errorHandler from './middlewares/error-handler.js';
const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());
app.use(express.static('./public'));

app.use(router);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Backend server running on port: ${port}`);
});