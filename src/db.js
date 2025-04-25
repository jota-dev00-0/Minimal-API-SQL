import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

const env = dotenv.config().parsed;
const db = await mysql.createPool({
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

});

try {
    await db.getConnection();
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
}
catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
}


export default db;
