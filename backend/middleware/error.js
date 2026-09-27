export function notFound(req, res) {
	res.status(404).json({ message: 'Resource not found' });
}

export function errorHandler(error, req, res, next) {
	if (error.code === 'ADMIN_CONFIG') return res.status(503).json({ message: 'Main Doctor login is not configured.' });
	if (error.code === 'JWT_CONFIG') return res.status(503).json({ message: 'Authentication service is not configured.' });

	const status = error.name === 'ValidationError' ? 400 : error.code === 11000 ? 409 : error.status || 500;
	if (status >= 500) console.error('Request failed:', error.name || 'Error', error.code || '');
	res.status(status).json({ message: status >= 500 ? 'Something went wrong on the server' : error.message });
}
