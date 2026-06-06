import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { StockModule } from './stock.module';

async function bootstrap() {
    const app = await NestFactory.create(StockModule);

    app.connectMicroservice({
        transport: Transport.RMQ,
        options: {
            urls: [
                `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST || 'rabbitmq'}:${process.env.RABBITMQ_PORT || 5672}`,
            ],
            queue: 'stock_queue',
            queueOptions: {
                durable: true,
            },
        },
    });

    await app.startAllMicroservices();
    await app.listen(process.env.PORT || 3004);
    console.log('Stock service listening on port 3004 (HTTP + RabbitMQ)');
}
bootstrap().catch((error) => {
    console.error('Error starting stock service:', error);
    process.exit(1);
});
