import { Router } from 'express';
import AuthRouter from 'src/modules/auth/authRouter';
import ProducerRouter from 'src/modules/producer/producerRouter';

// Add here all the routers of the application and logic general to all routers.

const router = Router();

// Middleware that passes the request to the next handler.
// You can add here all the logic you want for all the routers.
router.use((_req, _res, next) => {
  next();
});

// Mount each router under a specific path.
router.use('/auth', AuthRouter);
router.use('/producer', ProducerRouter);

export default router;
