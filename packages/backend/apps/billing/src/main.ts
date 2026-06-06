import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { BillingModule } from './billing.module';

async function bootstrap() {
    const app = await NestFactory.create(BillingModule);

    app.connectMicroservice({
        transport: Transport.RMQ,
        options: {
            urls: [
                `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST || 'rabbitmq'}:${process.env.RABBITMQ_PORT || 5672}`,
            ],
            queue: 'billing_queue',
            queueOptions: {
                durable: true,
            },
        },
    });

    await app.startAllMicroservices();
    await app.listen(process.env.PORT || 3002);
    console.log('Billing service listening on port 3002 (HTTP + RabbitMQ)');
}
bootstrap().catch((error) => {
    console.error('Error starting billing service:', error);
    process.exit(1);
});
