import createError from 'http-errors';
import express from 'express';
import helmet from 'helmet';
import path from 'path';
import logger from 'morgan';
import flash from 'connect-flash';
import rateLimiterMiddleware from './utils/rateLimiterMongoose.js';
import passport from './utils/passport.js';
import session from 'express-session';
import MongoDBStore from 'connect-mongodb-session';
const SessionStore = MongoDBStore(session);
import cryptoRandomString from 'crypto-random-string';

import indexRouter from './routes/index.js';
import deviceRouter from './routes/deviceRouter.js';
import fermentationRouter from './routes/fermentationRouter.js';
import userRouter from './routes/userRouter.js';
import apiRouter from './routes/apiRouter.js';

import {fileURLToPath} from 'url';
import {dirname} from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import dotenv from 'dotenv';
dotenv.config({path: 'variables.env'});

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

if (app.get('env') !== 'development') app.use(rateLimiterMiddleware);

const nonce = cryptoRandomString({length: 64, type: 'hex'});

app.use(
	helmet({
		referrerPolicy: {policy: 'same-origin'},
		contentSecurityPolicy: {
			useDefaults: true,
			directives: {
				defaultSrc: ["'self'"],
				objectSrc: ["'none'"],
				upgradeInsecureRequests: []
			}
		}
	})
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

const mongoSessionStore = new SessionStore({
	uri: process.env.DB,
	collection: 'userSessions',
	connectionOptions: {
		useNewUrlParser: true,
		useUnifiedTopology: true
	}
});

mongoSessionStore.on('error', error => {
	console.error(`  ❌  ❌  (Session store) ${error.message}  ❌  ❌  `);
});

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		cookie: {
			sameSite: 'lax',
			secure: app.get('env') === 'development' ? false : true
		},
		store: mongoSessionStore,
		resave: true,
		saveUninitialized: false,
		unset: 'keep',
		proxy: true
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
	res.locals.flashes = req.flash();
	res.locals.user = req.user || null;
	res.locals.currentPath = req.path;
	res.locals.nonce = nonce;
	next();
});

app.use('/user', userRouter);
app.use('/device', deviceRouter);
app.use('/fermentation', fermentationRouter);
app.use('/api', apiRouter);
app.use('/', indexRouter);

app.use((req, res, next) => {
	req.session = null;
	res.locals.flashes = null;
	next();
});

app.use((req, res, next) => {
	next(createError(404));
});

app.use((err, req, res, next) => {
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	res.status(err.status || 500);
	res.render('error');
});

export default app;
