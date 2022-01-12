import { Router } from 'express';
import authRouter from './auth.routes';

const router = Router();

// ---------------------------------------------------------
// Auth routes
// ---------------------------------------------------------
router.use('/auth', authRouter);

export default router;