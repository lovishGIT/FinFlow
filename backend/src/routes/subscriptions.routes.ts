import { Router } from 'express';
import * as subscriptionController from '@/controllers/subscription.controller.js';

const router = Router();

router
    .route('/')
    .get(subscriptionController.getAllSubscriptions)
    .post(subscriptionController.createSubscription);

router
    .route('/:id')
    .get(subscriptionController.getSubscriptionById)
    .put(subscriptionController.updateSubscription);

router
    .route('/toggle/:id')
    .get(subscriptionController.toggleSubscription);

export default router;
