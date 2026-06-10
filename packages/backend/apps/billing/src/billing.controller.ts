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
import { BillingService } from './billing.service';
import type { CreateInvoiceDto } from './dto/create-invoice.dto';
import type { UpdateInvoiceDto } from './dto/update-invoice.dto';

/** HTTP and RabbitMQ controller for billing operations. */
@Controller()
export class BillingController {
    constructor(private readonly billingService: BillingService) {}

    /** HTTP health-check endpoint. */
    @Get('health')
    getHealthHttp() {
        return { status: 'ok', service: 'billing' };
    }

    @Get('billing')
    findAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ) {
        return this.billingService.findAll(page, limit);
    }

    @Get('billing/:id')
    findById(@Param('id') id: string) {
        return this.billingService.findById(id);
    }

    @Post('billing')
    create(@Body() body: CreateInvoiceDto) {
        return this.billingService.create(body);
    }

    @Patch('billing/:id')
    update(@Param('id') id: string, @Body() body: UpdateInvoiceDto) {
        return this.billingService.update(id, body);
    }

    @Delete('billing/:id')
    remove(@Param('id') id: string) {
        return this.billingService.remove(id);
    }

    /** RabbitMQ health-check handler. */
    @MessagePattern('health')
    getHealth() {
        return { status: 'ok', service: 'billing' };
    }
}
