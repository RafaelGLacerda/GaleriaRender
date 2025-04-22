const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para arquivos estáticos
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Configurando upload com multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

app.use(express.json());

app.post('/upload', upload.single('video'), (req, res) => {
  const videoName = req.body.name;
  const filePath = `/uploads/${req.file.filename}`;

  const metadata = {
    name: videoName,
    path: filePath
  };

  const dataPath = path.join(__dirname, 'uploads', 'videos.json');
  let videos = [];

  if (fs.existsSync(dataPath)) {
    videos = JSON.parse(fs.readFileSync(dataPath));
  }

  videos.push(metadata);
  fs.writeFileSync(dataPath, JSON.stringify(videos, null, 2));

  res.json({ success: true, video: metadata });
});

app.get('/videos', (req, res) => {
  const dataPath = path.join(__dirname, 'uploads', 'videos.json');
  if (fs.existsSync(dataPath)) {
    const videos = JSON.parse(fs.readFileSync(dataPath));
    res.json(videos);
  } else {
    res.json([]);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
