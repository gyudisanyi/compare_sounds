import express from 'express';
import authHandler from '../middlewares/auth-handler.js';

import {
  registrationController,
  loginController,
  usersController,
  setsController,
  loopsController,
} from '../controllers/index.js';

const router = express.Router();

router.post('/users', registrationController.post);
router.post('/login', loginController.post);
router.get('/sets/:setId', setsController.getSetContents);
router.get('/sets', setsController.allSets);
router.get('/user/:username', usersController.getUserSets);
//router.get('/user/id/:userId', usersController.getUserById);
router.use(authHandler);
router.post('/loops/:setId', loopsController.newLoop);
router.patch('/loops/:setId', loopsController.editLoops);
router.post('/sets/new', setsController.newSet);
router.delete('/sets/:setId', setsController.deleteSet);
router.patch('/sets/:setId', setsController.editSets);

export default router;