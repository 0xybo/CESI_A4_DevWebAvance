import { NestFactory } from '@nestjs/core';
import { AuthenticationModule } from './authentication.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
    const app = await NestFactory.create(AuthenticationModule);

    app.connectMicroservice({
        transport: Transport.RMQ,
        options: {
            urls: [
                `amqp://${process.env.RABBITMQ_USER || 'rabbitmq_user'}:${process.env.RABBITMQ_PASSWORD || 'rabbitmq_password'}@${process.env.RABBITMQ_HOST || 'rabbitmq'}:${process.env.RABBITMQ_PORT || 5672}`,
            ],
            queue: 'authentication_queue',
            queueOptions: {
                durable: true,
            },
        },
    });

    await app.startAllMicroservices();
    await app.listen(process.env.PORT || 3001);
    console.log('Authentication service listening on port 3001 (HTTP + RabbitMQ)');
}
bootstrap().catch((error) => {
    console.error('Error starting authentication service:', error);
    process.exit(1);
});
