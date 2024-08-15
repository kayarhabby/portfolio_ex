import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import createError from 'http-errors';

import pool from './routes/db.js';
import indexRouter from './routes/index.js';
import projectsRouter from './routes/projects.js';
import skillsRouter from './routes/skills.js';
import usersRouter from './routes/users.js';
import bootcampRouter from './routes/bootcamps.js';

const app = express();

// view engine setup
app.set('views', path.join(path.dirname(new URL(import.meta.url).pathname), 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(path.dirname(new URL(import.meta.url).pathname), 'public')));

app.use('/', indexRouter);
app.use('/api', projectsRouter);
app.use('/api', skillsRouter);
app.use('/api', usersRouter);
app.use('/api', bootcampRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Fermer le pool lors de la fermeture de l'application
process.on('SIGINT', () => {
  pool.end(() => {
    console.log('Pool has ended');
    process.exit(0);
  });
});
export default app;
