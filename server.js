const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const FILE = path.join(__dirname, 'Matias Elstein.html');

app.use(express.json({ limit: '5mb' }));
app.use(express.static(__dirname));

app.get('/api/content', (req, res) => {
  fs.readFile(FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    const match = data.match(/<!--editable:body-->([\s\S]*?)<!--\/editable:body-->/);
    const body = match ? match[1] : '';
    res.json({ body });
  });
});

app.post('/api/save', (req, res) => {
  const newBody = req.body.body || '';
  fs.readFile(FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    const replaced = data.replace(/<!--editable:body-->([\s\S]*?)<!--\/editable:body-->/, `<!--editable:body-->${newBody}<!--/editable:body-->`);
    fs.writeFile(FILE, replaced, 'utf8', (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ ok: true });
    });
  });
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor admin en http://localhost:${PORT}/admin`);
});
