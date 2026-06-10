import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DeliveryService } from './delivery.service';
import type { CreateDeliveryDto } from './dto/create-delivery.dto';
import type { UpdateDeliveryDto } from './dto/update-delivery.dto';

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

    @Get('hubs')
    listHubs() {
        return this.deliveryService.listHubs();
    }

    @Post('hubs')
    createHub(@Body() body: any) {
        return this.deliveryService.createHub(body);
    }

    @Get('hubs/:id')
    getHub(@Param('id') id: string) {
        return this.deliveryService.getHub(id);
    }

    @Patch('hubs/:id')
    updateHub(@Param('id') id: string, @Body() body: any) {
        return this.deliveryService.updateHub(id, body);
    }

    @Get('deliveries')
    findAllDeliveries(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ) {
        return this.deliveryService.findAllDeliveries(page, limit);
    }

    @Post('deliveries')
    createDelivery(@Body() body: CreateDeliveryDto) {
        return this.deliveryService.createDelivery(body);
    }

    @Get('deliveries/:id')
    findDeliveryById(@Param('id') id: string) {
        return this.deliveryService.findDeliveryById(id);
    }

    @Patch('deliveries/:id')
    updateDelivery(@Param('id') id: string, @Body() body: UpdateDeliveryDto) {
        return this.deliveryService.updateDelivery(id, body);
    }

    @Delete('deliveries/:id')
    removeDelivery(@Param('id') id: string) {
        return this.deliveryService.removeDelivery(id);
    }
}
