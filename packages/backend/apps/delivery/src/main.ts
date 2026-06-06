import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { DeliveryModule } from './delivery.module';

async function bootstrap() {
    const app = await NestFactory.create(DeliveryModule);

    app.connectMicroservice({
        transport: Transport.RMQ,
        options: {
            urls: [
                `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST || 'rabbitmq'}:${process.env.RABBITMQ_PORT || 5672}`,
            ],
            queue: 'delivery_queue',
            queueOptions: {
                durable: true,
            },
        },
    });

    await app.startAllMicroservices();
    await app.listen(process.env.PORT || 3003);
    console.log('Delivery service listening on port 3003 (HTTP + RabbitMQ)');
}
bootstrap().catch((error) => {
    console.error('Error starting delivery service:', error);
    process.exit(1);
});
