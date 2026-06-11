import { Roles } from '@app/guards/roles.decorator';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { GatewayService } from '../gateway.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';

@Controller()
export class CustomersController {
    constructor(private readonly gatewayService: GatewayService) {}

    @ApiTags('Customers')
    @Get('customers')
    @ApiBearerAuth('JWT-auth')
    @Roles('admin', 'dispatcher', 'business_manager')
    @ApiOperation({ summary: 'List customers', description: 'Returns customers, optionally filtered by hub.' })
    @ApiQuery({ name: 'hub_id', required: false, type: String })
    @ApiResponse({ status: 200, description: 'List of customers' })
    listCustomers(@Query('hub_id') hub_id?: string, @Req() req?: Request) {
        return this.gatewayService.listCustomers(hub_id, (req as any).user);
    }

    @ApiTags('Customers')
    @Get('customers/:id')
    @ApiBearerAuth('JWT-auth')
    @Roles('admin', 'dispatcher', 'business_manager')
    @ApiOperation({ summary: 'Get customer by ID' })
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, description: 'Customer details' })
    @ApiResponse({ status: 404, description: 'Customer not found' })
    getCustomer(@Param('id') id: string, @Req() req?: Request) {
        return this.gatewayService.getCustomer(id, (req as any).user);
    }

    @ApiTags('Customers')
    @Post('customers')
    @ApiBearerAuth('JWT-auth')
    @Roles('admin', 'dispatcher')
    @ApiOperation({ summary: 'Create a customer' })
    @ApiResponse({ status: 201, description: 'Customer created' })
    createCustomer(@Body() body: CreateCustomerDto, @Req() req?: Request) {
        return this.gatewayService.createCustomer(body, (req as any).user);
    }

    @ApiTags('Customers')
    @Patch('customers/:id')
    @ApiBearerAuth('JWT-auth')
    @Roles('admin', 'dispatcher')
    @ApiOperation({ summary: 'Update a customer' })
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, description: 'Customer updated' })
    @ApiResponse({ status: 404, description: 'Customer not found' })
    updateCustomer(@Param('id') id: string, @Body() body: UpdateCustomerDto, @Req() req?: Request) {
        return this.gatewayService.updateCustomer(id, body, (req as any).user);
    }

    @ApiTags('Customers')
    @Delete('customers/:id')
    @ApiBearerAuth('JWT-auth')
    @Roles('admin')
    @ApiOperation({ summary: 'Delete a customer' })
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, description: 'Customer deleted' })
    @ApiResponse({ status: 404, description: 'Customer not found' })
    deleteCustomer(@Param('id') id: string, @Req() req?: Request) {
        return this.gatewayService.deleteCustomer(id, (req as any).user);
    }
}
