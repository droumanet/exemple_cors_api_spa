import express from 'express';
import cors from 'cors'; // <-- importé mais pas activé pour l'instant (démo pédagogique)

const app = express();
const PORT = 3000;

const originesAutorisees = [
  'http://localhost:4200',
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
  console.log(`Show tasks for ${proprio}`)
  if (!proprio) {
    return res.status(400).json({ error: 'Le paramètre proprio est requis (?proprio=qui' });
  }
  const tachesFiltrees = taches.filter(t => t.proprioTache === proprio);
  res.status(200).json(tachesFiltrees);
});

// POST - créer une tâche
app.post('/taches', (req, res) => {
  const { descTache, prioTache, doneTache, proprioTache } = req.body;
  console.log(`Add task for ${proprioTache} : ${descTache}`)
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
  const id = Number.parseInt(req.params.id);
  console.log(`update ${id}`)
  const tache = taches.find(t => t.idTache === id);
  if (!tache) return res.status(404).json({ error: 'Tâche non trouvée' });
  Object.assign(tache, req.body);
  res.json(tache);
});

// DELETE - supprimer une tâche
app.delete('/taches/:id', (req, res) => {
  const id = Number.parseInt(req.params.id);
    console.log(`delete ${id}`)
  taches = taches.filter(t => t.idTache !== id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`🚀 API Todolist démarrée sur http://localhost:${PORT}`);
});