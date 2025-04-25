import Fastify from 'fastify';
import dotenv from 'dotenv';    
import authRoutes from './routes/routes.js';


const fastify = Fastify({ logger: true });

fastify.register(authRoutes)


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