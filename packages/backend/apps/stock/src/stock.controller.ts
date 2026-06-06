import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { StockService } from './stock.service';

@Controller()
export class StockController {
    constructor(private readonly stockService: StockService) {}

    @Get('health')
    getHealthHttp() {
        return { status: 'ok', service: 'stock' };
    }

    @MessagePattern('health')
    getHealth() {
        return { status: 'ok', service: 'stock' };
    }
}
