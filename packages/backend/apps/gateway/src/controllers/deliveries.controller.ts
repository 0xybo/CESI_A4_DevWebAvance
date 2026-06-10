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
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../../../libs/guards/src/public.decorator';
import { GatewayService } from '../gateway.service';

@Controller()
export class DeliveriesController {
    constructor(private readonly gatewayService: GatewayService) {}

    @ApiTags('Deliveries')
    @Public()
    @Get('deliveries')
    @ApiOperation({ summary: 'List deliveries' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({ status: 200, description: 'Paginated list of deliveries' })
    getDeliveries(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ) {
        return this.gatewayService.getDeliveries(page, limit);
    }

    @ApiTags('Deliveries')
    @Public()
    @Get('deliveries/:id')
    @ApiOperation({ summary: 'Get delivery by ID' })
    @ApiParam({ name: 'id', description: 'Delivery UUID' })
    @ApiResponse({ status: 200, description: 'Delivery detail' })
    @ApiResponse({ status: 404, description: 'Delivery not found' })
    getDelivery(@Param('id') id: string) {
        return this.gatewayService.getDelivery(id);
    }

    @ApiTags('Deliveries')
    @Public()
    @Post('deliveries')
    @ApiOperation({ summary: 'Create a delivery' })
    @ApiResponse({ status: 201, description: 'Delivery created' })
    createDelivery(@Body() body: Record<string, unknown>) {
        return this.gatewayService.createDelivery(body);
    }

    @ApiTags('Deliveries')
    @Public()
    @Patch('deliveries/:id')
    @ApiOperation({ summary: 'Update a delivery' })
    @ApiParam({ name: 'id', description: 'Delivery UUID' })
    @ApiResponse({ status: 200, description: 'Delivery updated' })
    updateDelivery(@Param('id') id: string, @Body() body: Record<string, unknown>) {
        return this.gatewayService.updateDelivery(id, body);
    }

    @ApiTags('Deliveries')
    @Public()
    @Delete('deliveries/:id')
    @ApiOperation({ summary: 'Delete a delivery' })
    @ApiParam({ name: 'id', description: 'Delivery UUID' })
    @ApiResponse({ status: 200, description: 'Delivery deleted' })
    deleteDelivery(@Param('id') id: string) {
        return this.gatewayService.deleteDelivery(id);
    }
}
