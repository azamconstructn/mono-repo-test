import { Router } from 'express';
import { healthCheckController } from '../controllers';

export default function healthCheckRouter() {

  const router = Router();

  router.route('/basic-health-check').get(healthCheckController.basicHealthCheck);

  return router;

}