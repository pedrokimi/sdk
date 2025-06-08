const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

function getLogFileName() {
  const now = new Date();
  const dia = String(now.getDate()).padStart(2, '0');
  const mes = String(now.getMonth() + 1).padStart(2, '0');
  const ano = now.getFullYear();
  return `requests.log-${dia}-${mes}-${ano}`;
}

function registrarLog(info) {
  const logPath = path.join(__dirname, 'logs', getLogFileName());
  const logEntry = {
    timestamp: new Date().toISOString(),
    ...info
  };
  fs.appendFileSync(logPath, JSON.stringify(logEntry) + '\n', 'utf8');
}

app.post('/identity/verify', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const data = req.body;
  const resolucao = `${data.screen.width}x${data.screen.height}`;
  const log = {
    ip,
    usuario: data.usuario,
    userAgent: data.userAgent,
    language: data.language,
    timezone: data.timezone,
    resolucao
  };

  console.log("registrando log", log);
  registrarLog(log);

  res.json({
    mensagem: "dados coletados com sucesso",
    dados: {
      ip,
      usuario: data.usuario,
      userAgent: data.userAgent,
      language: data.language,
      timezone: data.timezone,
      resolution: resolucao
    }
  });
});

app.listen(PORT, () => {
  console.log(`servidor rodando em http://localhost:${PORT}`);
});