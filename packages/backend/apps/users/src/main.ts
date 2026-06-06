import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { UsersModule } from './users.module';

async function bootstrap() {
    const app = await NestFactory.create(UsersModule);

    app.connectMicroservice({
        transport: Transport.RMQ,
        options: {
            urls: [
                `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST || 'rabbitmq'}:${process.env.RABBITMQ_PORT || 5672}`,
            ],
            queue: 'users_queue',
            queueOptions: {
                durable: true,
            },
        },
    });

    await app.startAllMicroservices();
    await app.listen(process.env.PORT || 3005);
    console.log('Users service listening on port 3005 (HTTP + RabbitMQ)');
}
bootstrap().catch((error) => {
    console.error('Error starting users service:', error);
    process.exit(1);
});
