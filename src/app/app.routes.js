import express from 'express';

export default routes => {
	const router = express.Router();

	router.use('/', (req, res) => {
		res.send("Working");
	});

	/** GET /health-check - Check service health */
	router.get('/health-check', (req, res) => res.send('OK'));

	return router;
};