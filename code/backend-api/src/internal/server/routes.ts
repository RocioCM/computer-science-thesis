import { Router } from 'express';
import AuthRouter from 'src/modules/auth/authRouter';
import TrackingRouter from 'src/modules/tracking/trackingRouter';
import ProducerRouter from 'src/modules/producer/producerRouter';
import SecondaryProducerRouter from 'src/modules/secondaryProducer/secondaryProducerRouter';
import ConsumerRouter from 'src/modules/consumer/consumerRouter';
import RecyclerRouter from 'src/modules/recycler/recyclerRouter';

// Add here all the routers of the application and logic general to all routers.

const router = Router();

// Middleware that passes the request to the next handler.
// You can add here all the logic you want for all the routers.
router.use((_req, _res, next) => {
  next();
});

// Mount each router under a specific path.
router.use('/auth', AuthRouter);
router.use('/tracking', TrackingRouter);
router.use('/producer', ProducerRouter);
router.use('/secondary-producer', SecondaryProducerRouter);
router.use('/consumer', ConsumerRouter);
router.use('/recycler', RecyclerRouter);

export default router;
