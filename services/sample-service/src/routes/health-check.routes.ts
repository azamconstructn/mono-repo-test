import { Router } from 'express';
import { HealthCheckController } from '../controllers';

export default function healthCheckRouter() {

  const router = Router()

  const controller = new HealthCheckController()

  // GET enpdpoints

  router.route('/basic-health-check').get(controller.basicHealthCheck)

  return router
}