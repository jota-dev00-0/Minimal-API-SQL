import Fastify from 'fastify';
import dotenv from 'dotenv';    
import authRoutes from './routes/routes.js';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';



const fastify = Fastify({ logger: true });




fastify.register(fastifyCors, {
  origin: 'https://giovanaflores.github.io/sistema_de_login/',
  methods: ['GET', 'POST'],
  credentials: true,
});


fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET,
    sign: {expiresIn: '1h' }
})

fastify.register(authRoutes)

fastify.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({ message: 'Não autorizado' });
    }
  });


// Start the server
const start = async () => {
    try {
        await fastify.listen({ port: process.env.PORT || 3030});
        console.log(`API ligada no local http://localhost:3030 e porta ${process.env.PORT}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();