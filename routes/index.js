import express from 'express';
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET formulaire page. */
router.get('/formulaire', function(req, res, next) {
  res.render('formulaire', { title: 'Express' });
});

router.get('/index', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/dashboard', function(req, res, next) {
  res.render('dashboard', { title: 'Express' });
});

router.get('/projectDesc', function(req, res, next) {
  res.render('projectDesc', { title: 'Express' });
});

export default router;
