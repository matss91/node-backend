
import { Router } from 'express';
import { changePassword, checked, login, register, sendToken, verifyToken } from '../controllers/authController';
import { taskChangeState, taskRemove, taskStore, taskUpdate } from '../controllers/tasksController';
import { profile } from '../controllers/usersController';
import { collaboratorAdd, collaboratorRemove, proejectDetail, projectsList, projectRemove, projectStore, projectUpdate } from '../controllers/projectsController';
import { checkAuth } from '../middlewares';
const router = Router();

/* AUTH */
router
  .post('/register', register)
  .post('/login', login)
  .get('/checked', checked)
  .post('/send-token', sendToken)
  .route('/reset-password')
  .get(verifyToken)
  .post(changePassword);
  
/* PROYECTOS */
router
  .route('/projects')
  .get(checkAuth, projectsList)
  .post(checkAuth, projectStore)
router
  .route('/projects/:id')
  .get(checkAuth,proejectDetail)
  .put(checkAuth,projectUpdate)
  .delete(checkAuth,projectRemove)
router
  .get('/collaborator', collaboratorAdd)
  .delete('/collaborator', collaboratorRemove)

/* TAREAS */
router
  .route('/tasks')
  .post(checkAuth,taskStore)
router
  .route('/tasks/:id')
    .put(checkAuth,taskUpdate)
    .delete(checkAuth,taskRemove)
    .post(checkAuth,taskChangeState)

/* USUARIOS */
router
  .get('/profile',checkAuth, profile);


export default router;
