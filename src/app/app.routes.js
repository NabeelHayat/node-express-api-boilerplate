import express from 'express';

export default routes = () => {
	const routes = express.Router();

	routes.use('/', (req, res) => {
		res.send("Working");
	});

	/** GET /health-check - Check service health */
	routes.get('/health-check', (req, res) => res.send('OK'));

	return routes;
};