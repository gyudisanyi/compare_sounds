import express from 'express';
import mainController from './mainController.js';
import { registrationController } from '../controllers/index.js';

const router = express.Router();

router.post('/users', registrationController.post)
router.use('/', mainController);

export default router;