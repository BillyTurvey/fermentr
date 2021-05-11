import createError from 'http-errors';
import express from 'express';
import helmet from 'helmet';
import path from 'path';
import logger from 'morgan';
import flash from 'connect-flash';
// import passport from 'passport';
import session from 'express-session';
import MongoDBStore from 'connect-mongodb-session';
const SessionStore = MongoDBStore(session);

import indexRouter from './routes/index.js';
import deviceRouter from './routes/deviceRouter.js';
import userRouter from './routes/userRouter.js';

import {fileURLToPath} from 'url';
import {dirname} from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import dotenv from 'dotenv';
dotenv.config({path: 'variables.env'});

// import TokenStrategy from 'passport-accesstoken';
// const strategyOptions = {
//   tokenHeader: 'x-custom-token',
//   tokenField: 'custom-token'
// };

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.use(helmet({
//   referrerPolicy: { policy: 'same-origin'}
// }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

// Sessions allow us to store data on visitors from request to request
// This keeps users logged in and allows us to send flash messages

//// Where we will store session data
const mongoSessionStore = new SessionStore({
	uri: process.env.DB,
	collection: 'userSessions',
	connectionOptions: {
		// options passed to mongoose.connect()
		useNewUrlParser: true,
		useUnifiedTopology: true,
		serverSelectionTimeoutMS: 10000
	}
});

//// Catch session store errors
mongoSessionStore.on('error', function (error) {
	console.log(error);
});

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		cookie: {
			// maxAge: 1000 * 60 * 60 * 24 * 7,
			// without a max age property most clients will consider this a "non-persistent cookie"
			// and will delete it on a condition like exiting a web browser application
			sameSite: 'lax',
			secure: app.get('env') === 'development' ? false : true
		},
		store: mongoSessionStore,
		resave: true,
		saveUninitialized: false //required for where the law prohibits setting cookies without permission
	})
);

// // // Passport JS is what we use to handle our logins
// app.use(passport.initialize());
// app.use(passport.session());

// pass variables to our templates + all requests
app.use((req, res, next) => {
	res.locals.flashes = req.flash();
	next();
});

// Routes
app.use('/', indexRouter);
app.use('/device', deviceRouter);
app.use('/user', userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

export default app;
