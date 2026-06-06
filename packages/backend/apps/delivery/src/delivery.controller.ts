import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DeliveryService } from './delivery.service';

@Controller()
export class DeliveryController {
    constructor(private readonly deliveryService: DeliveryService) {}

    @Get('health')
    getHealthHttp() {
        return { status: 'ok', service: 'delivery' };
    }

    @MessagePattern('health')
    getHealth() {
        return { status: 'ok', service: 'delivery' };
    }
}
