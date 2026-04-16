const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

let db;

// Conexão com o Banco de Dados
async function conectarBanco() {
    try {
        db = await mysql.createPool({
            host: 'localhost',
            user: 'root',      
            password: 'Senai@118', // <--- COLOQUE SUA SENHA AQUI
            database: 'family_hub'
        });

        console.log("📦 Conectado ao MySQL com sucesso!");

        // Criar as tabelas se não existirem
        await db.query(`CREATE TABLE IF NOT EXISTS rotina (
            id INT AUTO_INCREMENT PRIMARY KEY,
            tarefa VARCHAR(255),
            quem VARCHAR(100)
        )`);

        await db.query(`CREATE TABLE IF NOT EXISTS eventos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            titulo VARCHAR(255),
            data DATE
        )`);

        await db.query(`CREATE TABLE IF NOT EXISTS membros (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(45),
            email VARCHAR(45),
            senha VARCHAR(45),
            funcao VARCHAR(45)
        )`);

    } catch (erro) {
        console.error("❌ Erro ao conectar:", erro.message);
    }
}
conectarBanco();

// --- ROTAS DE TAREFAS ---
app.get('/tarefas', async (req, res) => {
    try {
        const [linhas] = await db.query("SELECT * FROM rotina");
        res.json(linhas);
    } catch (e) { res.status(500).send(e); }
});

app.post('/tarefas', async (req, res) => {
    try {
        await db.query("INSERT INTO rotina (tarefa, quem) VALUES (?, ?)", [req.body.tarefa, req.body.quem]);
        res.json({ok: true});
    } catch (e) { res.status(500).send(e); }
});

app.put('/tarefas/:id', async (req, res) => {
    try {
        await db.query("UPDATE rotina SET tarefa = ?, quem = ? WHERE id = ?", [req.body.tarefa, req.body.quem, req.params.id]);
        res.json({ok: true});
    } catch (e) { res.status(500).send(e); }
});

app.delete('/tarefas/:id', async (req, res) => {
    try {
        await db.query("DELETE FROM rotina WHERE id = ?", [req.params.id]);
        res.json({ok: true});
    } catch (e) { res.status(500).send(e); }
});

// --- ROTAS DE EVENTOS ---
app.get('/eventos', async (req, res) => {
    try {
        const [linhas] = await db.query("SELECT * FROM eventos ORDER BY data ASC");
        res.json(linhas);
    } catch (e) { res.status(500).send(e); }
});

app.post('/eventos', async (req, res) => {
    try {
        await db.query("INSERT INTO eventos (titulo, data) VALUES (?, ?)", [req.body.titulo, req.body.data]);
        res.json({ok: true});
    } catch (e) { res.status(500).send(e); }
});

app.put('/eventos/:id', async (req, res) => {
    try {
        await db.query("UPDATE eventos SET titulo = ?, data = ? WHERE id = ?", [req.body.titulo, req.body.data, req.params.id]);
        res.json({ok: true});
    } catch (e) { res.status(500).send(e); }
});

app.delete('/eventos/:id', async (req, res) => {
    try {
        await db.query("DELETE FROM eventos WHERE id = ?", [req.params.id]);
        res.json({ok: true});
    } catch (e) { res.status(500).send(e); }
});

app.listen(3000, () => {
    console.log("🚀 Servidor rodando em http://localhost:3000");
});