import { Roles } from '@app/guards/roles.decorator';
import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateParcelDto } from '../dto/create-parcel.dto';
import { GatewayService } from '../gateway.service';

@Controller()
export class InvoicesController {
    constructor(private readonly gatewayService: GatewayService) {}

    @ApiTags('Parcels')
    @Get('parcels')
    @ApiBearerAuth('JWT-auth')
    @Roles('admin', 'dispatcher')
    @ApiOperation({ summary: 'List all parcels', description: 'Returns a paginated list of all parcels.' })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 100 })
    @ApiResponse({ status: 200, description: 'Paginated list of parcels' })
    listAllParcels(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
        @Req() req: Request,
    ) {
        return this.gatewayService.listAllParcels(page, limit, (req as any).user);
    }

    @ApiTags('Invoices')
    @Post('invoices/:id/parcels')
    @ApiBearerAuth('JWT-auth')
    @Roles('admin', 'dispatcher')
    @ApiOperation({ summary: 'Add a parcel', description: 'Add a parcel to an invoice and recalculate amount.' })
    @ApiParam({ name: 'id', description: 'Invoice UUID' })
    @ApiResponse({ status: 201, description: 'Parcel created' })
    addParcel(@Param('id') id: string, @Body() body: CreateParcelDto, @Req() req: Request) {
        return this.gatewayService.addParcel(id, body, (req as any).user);
    }

    @ApiTags('Invoices')
    @Get('invoices/:id/parcels')
    @ApiBearerAuth('JWT-auth')
    @Roles('admin', 'dispatcher')
    @ApiOperation({ summary: 'List parcels', description: 'List all parcels for an invoice.' })
    @ApiParam({ name: 'id', description: 'Invoice UUID' })
    @ApiResponse({ status: 200, description: 'List of parcels' })
    listParcels(@Param('id') id: string, @Req() req: Request) {
        return this.gatewayService.listParcels(id, (req as any).user);
    }

    @ApiTags('Parcels')
    @Get('parcels/:id')
    @ApiBearerAuth('JWT-auth')
    @Roles('admin', 'dispatcher')
    @ApiOperation({ summary: 'Get a parcel by ID' })
    @ApiParam({ name: 'id', description: 'Parcel UUID' })
    @ApiResponse({ status: 200, description: 'Parcel details' })
    @ApiResponse({ status: 404, description: 'Parcel not found' })
    getParcel(@Param('id') id: string, @Req() req: Request) {
        return this.gatewayService.getParcel(id, (req as any).user);
    }

    @ApiTags('Parcels')
    @Patch('parcels/:id')
    @ApiBearerAuth('JWT-auth')
    @Roles('admin', 'dispatcher')
    @ApiOperation({ summary: 'Update a parcel', description: 'Update weight or reference of a parcel.' })
    @ApiParam({ name: 'id', description: 'Parcel UUID' })
    @ApiResponse({ status: 200, description: 'Parcel updated' })
    @ApiResponse({ status: 404, description: 'Parcel not found' })
    updateParcel(@Param('id') id: string, @Body() body: { weight?: number; reference?: string }, @Req() req: Request) {
        return this.gatewayService.updateParcel(id, body, (req as any).user);
    }

    @ApiTags('Invoices')
    @Delete('invoices/:id/parcels/:parcelId')
    @ApiBearerAuth('JWT-auth')
    @Roles('admin', 'dispatcher')
    @ApiOperation({
        summary: 'Delete a parcel',
        description: 'Remove a parcel from an invoice and recalculate amount.',
    })
    @ApiParam({ name: 'id', description: 'Invoice UUID' })
    @ApiParam({ name: 'parcelId', description: 'Parcel UUID' })
    @ApiResponse({ status: 200, description: 'Parcel deleted' })
    deleteParcel(@Param('id') id: string, @Param('parcelId') parcelId: string, @Req() req: Request) {
        return this.gatewayService.deleteParcel(id, parcelId, (req as any).user);
    }
}
