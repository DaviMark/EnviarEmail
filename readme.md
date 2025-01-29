# Orçamento API & Email Scheduler

## Descrição
Este projeto é uma API desenvolvida com **Node.js** e **Express** que se conecta a um banco de dados SQL Server para recuperar informações financeiras e armazená-las em cache. Além disso, o sistema possui uma funcionalidade de envio automatizado de relatórios via email, utilizando **Nodemailer** e **node-cron** para agendamentos periódicos.

## Funcionalidades
- **API RESTful** com endpoints para consulta de dados financeiros
- **Cache otimizado** para melhorar a performance
- **Agendamento de tarefas** para atualização do cache e envio de emails automático
- **Envio de relatórios financeiros por email** em formato HTML estruturado

## Tecnologias Utilizadas
- **Node.js**
- **Express.js**
- **MSSQL** (Microsoft SQL Server)
- **CORS** (Cross-Origin Resource Sharing)
- **Nodemailer** (Envio de emails)
- **Axios** (Requisição HTTP para consumo de API)
- **node-cron** (Agendamento de tarefas)

## Instalação
1. Clone o repositório:
   ```sh
   git clone https://github.com/seu-usuario/seu-repositorio.git
   ```

2. Acesse o diretório do projeto:
   ```sh
   cd seu-repositorio
   ```

3. Instale as dependências:
   ```sh
   npm install
   ```

## Configuração
Antes de rodar o projeto, configure os seguintes arquivos:

1. **Banco de Dados**: Edite a configuração de conexão no arquivo `server.js`:
   ```js
   const config = {
       user: 'seu_usuario',
       password: 'sua_senha',
       server: 'seu_servidor',
       port: 1537,
       database: 'seu_banco',
       options: {
           encrypt: false,
           trustServerCertificate: true,
           requestTimeout: 300000
       }
   };
   ```

2. **Configuração de Email**: No arquivo `emailService.js`, ajuste os dados do SMTP:
   ```js
   const transporter = nodemailer.createTransport({
       host: 'smtp.seu-dominio.com',
       port: 587,
       secure: false,
       auth: {
           user: 'seu_email',
           pass: 'sua_senha'
       },
       tls: {
           rejectUnauthorized: false
       }
   });
   ```

## Executando o Projeto
1. Inicie o servidor:
   ```sh
   npm start
   ```
2. A API estará disponível em:
   - [http://localhost:3000/api/orcamento-email](http://localhost:3000/api/orcamento-email)
   - [http://localhost:3000/api/orcamento-email-cache](http://localhost:3000/api/orcamento-email-cache)

## Endpoints da API
| Método | Endpoint | Descrição |
|---------|------------|-------------|
| GET | `/api/orcamento-email` | Busca dados diretamente do banco |
| GET | `/api/orcamento-email-cache` | Retorna dados armazenados em cache |

## Agendamento de Tarefas
- Atualiza o cache a cada **5 minutos**
- Envia emails automáticos com relatórios financeiros

## Autor
- **Seu Nome** - [seu GitHub](https://github.com/seu-usuario)

## Licença
Este projeto está licenciado sob a [MIT License](LICENSE).