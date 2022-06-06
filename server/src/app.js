require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const authRouter = require('./routes/auth.routes');
const postRouter = require('./routes/post.routes')
const errorHandler = require('./middleware/error-handler');

const AppError = require('./error/app-error');

const app = express();

// cors
app.use(cors({
    origin: process.env.CLIENT_URL,
    credential: true
}));

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

/* Routes */
// Auth
app.use('/api/auth', authRouter);
// Post
app.use('/api/post', postRouter);

// Unhandled routes
app.all('*', (req, res, next) => {
    next(AppError.notFound('Not found'));
})

// Error route
app.use(errorHandler);

module.exports = app;
