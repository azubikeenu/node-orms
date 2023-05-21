import express, { Router } from 'express';
import userRoutes from './user.routes';
import healthRoutes from './health.routes';

const router = express.Router();

interface Route {
  path: string;
  routes: Router;
}

const routes: Route[] = [
  {
    path: '/users',
    routes: userRoutes,
  },
  {
    path: '/health-check',
    routes: healthRoutes,
  },
];

routes.forEach((route: Route) => {
  router.use(route.path, route.routes);
});

export { router };
