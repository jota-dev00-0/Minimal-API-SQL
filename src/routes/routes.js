
import bcrypt from "bcryptjs";
import db from "../db.js";

export default async function authRoutes(fastify, options) {
    fastify.post("/register", async (request, reply) => {
        const { username, password, email } = request.body;
        if (!username || !password || !email) {
            return reply.status(400).send({ message: 'Dados incompletos' });
        }

        try {
            // Verificar se usuário já existe
            const [existing] = await db.query(
                'SELECT id FROM users WHERE username = ? OR email = ?',
                [username, email] 
            );
    
            if (existing) {
                return reply.status(409).send({ message: 'Usuário já existe' });
            }
    
            // Hash da senha
            const hashedPassword = await bcrypt.hash(password, 10);
    
            // Inserir no banco
            const [result] = await db.query(
                'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
                [username, hashedPassword, email]
            );
    
            return { 
                message: "Usuário registrado com sucesso",
                id: result.insertId
            };
        } catch (error) { 
            console.error(error);
            return reply.status(500).send({ message: 'Erro ao registrar usuário' });
        }
    });


    fastify.post('/login', async (request, reply) => {
      const { username, password } = request.body; 
      
      if (!username || !password) {
          return reply.status(400).send({ message: 'Credenciais obrigatórias' });
      } 

      
  
      try {
          // 1. Buscar usuário no banco
          const [user] = await db.query(
              'SELECT * FROM users WHERE username = ?', 
              [username] 
          );
  
          // 2. Verificar existência e senha
          if (!user || !(await bcrypt.compare(password, user.password))) {
              return reply.status(401).send({ message: 'Credenciais inválidas' });
          }
  
          // 3. Gerar token JWT
          const token = fastify.jwt.sign({ userId: user.id });
          token.expiresIn = '1h'; // Defina o tempo de expiração do token conforme necessário

          
          return { token };
          
      } catch (error) {
          reply.status(500).send({ message: 'Erro no servidor' });
      }
  });

  fastify.get("/users", async (request, reply) => {
    try {
        const [users] = await db.query('SELECT id, username, email FROM users');
        return users;
    } catch (error) {
        reply.status(500).send({ message: 'Erro ao buscar usuários' });
    }
  })
} 


