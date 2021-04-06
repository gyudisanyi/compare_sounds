import express from 'express';
import authHandler from '../middlewares/auth-handler.js';

import {
  registrationController,
  loginController,
  setsController,
} from '../controllers/index.js';

const router = express.Router();

router.post('/users', registrationController.post);
router.post('/login', loginController.post);
router.use(authHandler);
router.post('/sets/new', setsController.newSet);
router.get('/sets/:setId', setsController.setContents);
router.get('/sets', setsController.userSets);
router.patch('/sets/:setId', setsController.editSets);

export default router;