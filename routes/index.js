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

/* GET form page with action and table parameters */
// Route pour rendre le formulaire
router.get('/form', (req, res) => {
  const action = req.query.action; // 'add' ou 'edit'
  const table = req.query.table;   // 'projects', 'skills', 'bootcamps'
  const id = req.query.id;         // ID pour 'edit'

  // Passer les données nécessaires au template
  res.render('form', {
    title: action === 'edit' ? 'Edit Item' : 'Add Item',
    formTitle: action === 'edit' ? 'Edit Item' : 'Add Item',
    action: action,
    table: table,
    id: id
  });
});

export default router;
