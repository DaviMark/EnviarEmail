const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const cron = require('node-cron');

const app = express();
const port = 3000;

// Configuração do banco de dados
const config = {
    user: 'sa',
    password: '1qaz@WSX',
    server: '192.168.0.251',
    port: 1537,
    database: 'pbi_dw',
    options: {
        encrypt: false,
        trustServerCertificate: true,
        requestTimeout: 300000 // 5 minutos
    }
};

app.use(cors());
app.use(express.json());

// Variáveis globais
let cacheData = [];
let pool = null; // Reutilizando a conexão do pool

// Inicializa o pool de conexões com o banco
const initializePool = async () => {
    try {
        pool = await sql.connect(config);
        console.log('Conexão com o banco de dados inicializada com sucesso.');
    } catch (err) {
        console.error('Erro ao inicializar o pool de conexões:', err.message || err);
        throw err;
    }
};

// Função para buscar dados do banco
const fetchData = async () => {
    if (!pool) {
        throw new Error('O pool de conexões não está inicializado.');
    }
    try {
        const result = await pool.request().query('SELECT * FROM VW_ORCAMENTO_EMAIL WHERE ANALIT IN (110, 109, 124)');
        return result.recordset;
    } catch (err) {
        console.error('Erro ao buscar dados do banco:', err.message || err);
        throw err;
    }
};

// Atualiza o cache com os dados do banco
const updateCache = async () => {
    console.log('Atualizando cache...');
    try {
        cacheData = await fetchData();
        console.log('Cache atualizado com sucesso.');
    } catch (err) {
        console.error('Erro ao atualizar o cache:', err.message || err);
    }
};

// Agendamento com node-cron para atualizar cache a cada 5 minutos
cron.schedule('*/5 * * * *', async () => {
    console.log('Executando cron job para atualizar cache...');
    await updateCache();
});

// Rota para buscar dados diretamente do banco
app.get('/api/orcamento-email', async (req, res) => {
    try {
        const data = await fetchData();
        res.json(data);
    } catch (err) {
        console.error('Erro ao obter dados do banco:', err.message || err);
        res.status(500).json({ error: 'Erro ao obter os dados do banco.' });
    }
});

// Rota para retornar dados do cache
app.get('/api/orcamento-email-cache', (req, res) => {
    res.json(cacheData);
});

// Inicialização do servidor
app.listen(port, '0.0.0.0', async () => {
    console.log('Inicializando servidor...');
    try {
        // Inicializa o pool de conexões e popula o cache ao iniciar
        await initializePool();
        await updateCache();

        console.log(`Servidor rodando em:
        - http://localhost:${port}/api/orcamento-email
        - http://localhost:${port}/api/orcamento-email-cache`);
    } catch (err) {
        console.error('Erro ao inicializar o servidor:', err.message || err);
    }
});
