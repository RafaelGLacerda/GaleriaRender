const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Pasta de uploads
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);

// Configura multer para salvar vídeos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

// Middleware
app.use(express.static('public'));
app.use('/videos', express.static('uploads'));
app.use(express.json());

// Upload de vídeo
app.post('/upload', upload.single('video'), (req, res) => {
  res.json({ message: 'Upload feito com sucesso!' });
});

// Listagem de vídeos
app.get('/api/videos', (req, res) => {
  fs.readdir(UPLOADS_DIR, (err, files) => {
    if (err) return res.status(500).json({ error: 'Erro ao listar vídeos' });
    const videos = files.filter(f => /\.(mp4|webm|ogg)$/i.test(f));
    res.json(videos);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
