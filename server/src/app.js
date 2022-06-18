require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const authRouter = require('./routes/auth.routes');
const postRouter = require('./routes/post.routes')
const tagRouter = require('./routes/tag.routes')
const errorHandler = require('./middleware/error-handler');

const AppError = require('./error/app-error');
const config = require('./config/config');

const app = express();

// cors
app.use(cors({
    origin: config.clientUrl,
    credential: true
}));

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

/* Routes */
app.use('/api/auth', authRouter);
app.use('/api/post', postRouter);
app.use('/api/tag', tagRouter);

// Unhandled routes
app.all('*', (req, res, next) => {
    next(AppError.notFound('Not found'));
})

// Error route
app.use(errorHandler);

module.exports = app;
