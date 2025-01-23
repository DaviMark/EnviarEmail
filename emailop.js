const nodemailer = require('nodemailer');
const axios = require('axios');
const cron = require('node-cron'); // Importa o pacote node-cron

// Configuração do transporte de email
const transporter = nodemailer.createTransport({
    host: 'smtp.pitransportes.com.br', // Exemplo: smtp.gmail.com
    port: 587, // Porta padrão para TLS
    secure: false, // Não usar SSL direto
    auth: {
        user: 'david.marques@pitransportes.com.br', // Email do remetente
        pass: 'Pi@2024' // Senha ou token do email
    },
    tls: {
        rejectUnauthorized: false // Permitir conexões inseguras (usar com cautela)
    }
});

// Teste inicial do transporte de email
transporter.verify((error, success) => {
    if (error) {
        console.error('Erro na configuração do transporte de email:', error.message || error);
    } else {
        console.log('Transporte de email configurado com sucesso!');
    }
});

// Função para formatar os dados como uma tabela em HTML
const formatDataAsTable = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
        return '<p>Nenhum dado encontrado.</p>';
    }

    let tableRows = data
        .map(row => `
            <tr>
                <td>${row.MESANO || ''}</td>
                <td>${row.CENGASTO || ''}</td>
                <td>${row.CENCUSTO || ''}</td>
                <td>${row.SINTET || ''}</td>
                <td>${row.SINTETICA || ''}</td>
                <td>${row.ANALIT || ''}</td>
                <td>${row.ANALITICA || ''}</td>
                <td>R$ ${row.VLRPRE || ''}</td>
                <td>R$ ${row.VALOR || ''}</td>
                <td>R$ ${row.SALDO || ''}</td>
            </tr>
        `)
        .join('');

    return `
      <table border="1" style="
            border-collapse: collapse;
            width: 100%;
            font-family: 'Open Sans', sans-serif;
            border: 1px solid #ddd;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            transition: transform 0.3s ease, box-shadow 0.3s ease;">
        <thead>
            <tr style="
                background-color: #061795; 
                color: #fff; 
                text-align: left; 
                font-size: 1rem;">
            <th style="padding: 12px; border-right: 1px solid #ddd;">Mes/Ano</th>
            <th style="padding: 12px; border-right: 1px solid #ddd;">Centro de Gasto</th>
            <th style="padding: 12px; border-right: 1px solid #ddd;">Centro de Custo</th>
            <th style="padding: 12px; border-right: 1px solid #ddd;">Cod. Sintetico</th>
            <th style="padding: 12px; border-right: 1px solid #ddd;">Classe Sintetica</th>
            <th style="padding: 12px; border-right: 1px solid #ddd;">Cod. Analitico</th>
            <th style="padding: 12px; border-right: 1px solid #ddd;">Classe Analitica</th>
            <th style="padding: 12px; border-right: 1px solid #ddd;">Valor Previsto</th>
            <th style="padding: 12px; border-right: 1px solid #ddd;">Valor Realizado</th>
            <th style="padding: 12px;">Saldo</th>
            </tr>
        </thead>
        <tbody style="
            font-size: 0.9rem; 
            transition: all 0.3s ease;">
            ${tableRows}
        </tbody>
        </table>

    `;
};

// Função principal para buscar dados e enviar o email
const sendEmail = async () => {
    try {
        // Faz uma requisição para a API
        const response = await axios.get('http://localhost:3000/api/orcamento-email-cache');
        const data = response.data;

        if (!data || data.length === 0) {
            console.log('Nenhum dado encontrado para enviar.');
            return;
        }

        // Formata os dados como tabela HTML
        const htmlTable = formatDataAsTable(data);

        // Configuração do email
        const mailOptions = {
            from: '"David Marques" <david.marques@pitransportes.com.br>', // Nome e email do remetente
            to: 'david.marques@pitransportes.com.br', // Destinatário
            subject: 'Relatório do Orçamento', // Assunto
            html: `
               <div style="
                    font-family: 'Arial', sans-serif; 
                    background-color: #f9f9f9; 
                    padding: 20px; 
                    border: 1px solid #ddd; 
                    border-radius: 10px; 
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Saudação -->
                    <h3 style="
                        font-size: 1.8rem; 
                        font-family:'Georgia', serif; 
                        color: #061795; 
                        text-align: left;
                        margin-bottom: 10px;">
                        <strong>Bom dia,</strong>
                    </h3>
                    
                    <!-- Introdução -->
                    <p style="
                        font-size: 1rem; 
                        font-family:'Georgia', serif; 
                        color: #333; 
                        line-height: 1.6; 
                        margin-bottom: 20px;">
                        Segue abaixo a relação do valor previsto e realizado das respectivas contas:
                    </p>
                    
                    <!-- Tabela -->
                    ${htmlTable}
                    
                    <!-- Rodapé -->
                    <div style="
                        text-align: center; 
                        margin-top: 20px; 
                        padding: 15px; 
                        background-color:rgb(255, 255, 255); 
                        color: #000; 
                        border-radius: 5px; 
                        box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.2);">
                        
                        <p style="
                            margin: 0; 
                            font-size: 0.9rem; 
                            line-height: 1.5;">
                            Enviado de forma automática pelo setor de Tecnologia da Informação.
                        </p>
                        
                        <p style="
                            margin: 10px 0 0; 
                            font-size: 0.8rem; 
                            font-weight: bold;">
                            &copy; <span style="font-size: 1rem;">Pitransportes</span> <br>
                            <span style="font-size: 0.8rem;">Transportando Produtividade</span>
                        </p>
                    </div>
                </div>
                ` // Corpo do email
        };

        // Envia o email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email enviado com sucesso:', info.messageId);
    } catch (error) {
        if (error.response) {
            console.error('Erro na resposta da API:', error.response.data || error.response.status);
        } else if (error.request) {
            console.error('Erro na requisição da API:', error.message || error);
        } else {
            console.error('Erro ao enviar email:', error.message || error);
        }
    }
};


// Agendamento da tarefa diária às 08:00
cron.schedule('0 8 * * *', () => {
    console.log('Iniciando envio automático do email às 08:00.');
    sendEmail(); // Chama a função principal para enviar o email
});
