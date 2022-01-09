import express from 'express';

const router = express.Router();

router.use('/', (req, res) => {
	res.send("Working");
});

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.json('OK'));

export default router;