import express from 'express';
import cors from 'cors'; // <-- importé mais pas activé pour l'instant (démo pédagogique)

const app = express();
const PORT = 4000;

const originesAutorisees = [
  'http://localhost:3000',
];

app.use(cors({
  origin: originesAutorisees,
}));


app.use(express.json());

// "Base de données" en mémoire
let taches = [
  { idTache: 1, descTache: 'Réviser CORS', prioTache: 2, doneTache: false, proprioTache: 'alice' },
  { idTache: 2, descTache: 'Finir le TP Angular', prioTache: 1, doneTache: false, proprioTache: 'bob' }
];
let nextId = 3;

// GET - lire uniquement les tâches du propriétaire (query param ?proprio=nom)
app.get('/taches', (req, res) => {
  const { proprio } = req.query;
  if (!proprio) {
    return res.status(400).json({ error: 'Le paramètre proprio est requis' });
  }
  const tachesFiltrees = taches.filter(t => t.proprioTache === proprio);
  res.json(tachesFiltrees);
});

// POST - créer une tâche
app.post('/taches', (req, res) => {
  const { descTache, prioTache, doneTache, proprioTache } = req.body;
  const nouvelleTache = {
    idTache: nextId++,
    descTache,
    prioTache,
    doneTache: doneTache ?? false,
    proprioTache
  };
  taches.push(nouvelleTache);
  res.status(201).json(nouvelleTache);
});

// PUT - mettre à jour une tâche (ex: cocher doneTache)
app.put('/taches/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const tache = taches.find(t => t.idTache === id);
  if (!tache) return res.status(404).json({ error: 'Tâche non trouvée' });
  Object.assign(tache, req.body);
  res.json(tache);
});

// DELETE - supprimer une tâche
app.delete('/taches/:id', (req, res) => {
  const id = parseInt(req.params.id);
  taches = taches.filter(t => t.idTache !== id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`🚀 API Todolist démarrée sur http://localhost:${PORT}`);
});