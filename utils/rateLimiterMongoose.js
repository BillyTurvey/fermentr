import {RateLimiterMongo} from 'rate-limiter-flexible';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({path: 'variables.env'});

mongoose
	.connect(process.env.DB, {
		reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
		reconnectInterval: 100, // Reconnect every 100ms
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false
	})
	.catch(err => {
		console.error(`  ❌  ❌  (Rate limiter) ${err.message}  ❌  ❌  `);
	});
const mongoConn = mongoose.connection;

const limiterOptions = {
	storeClient: mongoConn,
	dbName: 'rateLimiter',
	points: 10, // Number of points
	duration: 1 // Per second(s)
};

const rateLimiter = new RateLimiterMongo(limiterOptions);

const rateLimiterMiddleware = (req, res, next) => {
	rateLimiter
		.consume(req.ip)
		.then(() => {
			next();
		})
		.catch(() => {
			res.status(429).send('Too Many Requests');
		});
};

export default rateLimiterMiddleware;
