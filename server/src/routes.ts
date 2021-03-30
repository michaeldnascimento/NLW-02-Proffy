import express from 'express';
import ClassController from './controllers/ClassesController';
import ConnectionsController from './controllers/ConnectionsController';

const routes = express.Router();
const classControllers = new ClassController();
const connectionsCotroller = new ConnectionsController();

routes.get('/classes', classControllers.index);
routes.post('/classes', classControllers.create);

routes.get('/connections', connectionsCotroller.index)
routes.post('/connections', connectionsCotroller.create)
export default routes;
