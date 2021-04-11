import express from 'express';
import authHandler from '../middlewares/auth-handler.js';

import {
  registrationController,
  loginController,
  setsController,
  soundsController,
} from '../controllers/index.js';

const router = express.Router();

router.post('/users', registrationController.post);
router.post('/login', loginController.post);
router.use(authHandler);

router.post('/sets/new', setsController.newSet);
router.delete('/sets/:setId', setsController.deleteSet);
router.get('/sets/:setId', setsController.getSetContents);
router.patch('/sets/:setId', setsController.editSets);
router.get('/sets', setsController.userSets);

export default router;