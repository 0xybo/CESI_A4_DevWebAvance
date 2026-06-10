import { Public } from '@app/guards/public.decorator';
import { Roles } from '@app/guards/roles.decorator';
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
    Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { GatewayService } from '../gateway.service';

@Controller()
export class UsersController {
    constructor(private readonly gatewayService: GatewayService) {}

    @ApiTags('Users')
    @Public()
    @Get('users')
    @ApiOperation({ summary: 'List users' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({ status: 200, description: 'Paginated list of users' })
    getUsers(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ) {
        return this.gatewayService.getUsers(page, limit);
    }

    @ApiTags('Users')
    @Public()
    @Post('users')
    @ApiOperation({ summary: 'Create a user' })
    @ApiResponse({ status: 201, description: 'User created' })
    createUser(@Body() body: Record<string, unknown>) {
        return this.gatewayService.createUser(body);
    }

    @ApiTags('Users')
    @Post('users/:id/driver')
    @ApiBearerAuth('JWT-auth')
    @Roles('admin', 'dispatcher', 'driver')
    @ApiOperation({
        summary: 'Create driver profile',
        description: 'Create a Driver profile for the specified user. The user must have the driver role.',
    })
    @ApiParam({ name: 'id', description: 'User UUID' })
    @ApiResponse({ status: 201, description: 'Driver profile created' })
    @ApiResponse({ status: 400, description: 'User does not have driver role or profile already exists' })
    @ApiResponse({ status: 404, description: 'User not found' })
    createDriver(@Param('id') id: string, @Body() body: { vehicle_id?: string; rating?: number }, @Req() req: Request) {
        return this.gatewayService.createDriver(id, body, (req as any).user);
    }

    @ApiTags('Users')
    @Get('users/:id/driver')
    @ApiBearerAuth('JWT-auth')
    @Roles('admin', 'dispatcher', 'driver')
    @ApiOperation({ summary: 'Get driver profile', description: 'Retrieve the Driver profile for the specified user.' })
    @ApiParam({ name: 'id', description: 'User UUID' })
    @ApiResponse({ status: 200, description: 'Driver profile' })
    @ApiResponse({ status: 404, description: 'User or Driver profile not found' })
    getDriver(@Param('id') id: string, @Req() req: Request) {
        return this.gatewayService.getDriver(id, (req as any).user);
    }

    @ApiTags('Users')
    @Public()
    @Get('users/:id')
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiParam({ name: 'id', description: 'User UUID' })
    @ApiResponse({ status: 200, description: 'User detail' })
    @ApiResponse({ status: 404, description: 'User not found' })
    getUser(@Param('id') id: string) {
        return this.gatewayService.getUser(id);
    }

    @ApiTags('Users')
    @Public()
    @Patch('users/:id')
    @ApiOperation({ summary: 'Update a user' })
    @ApiParam({ name: 'id', description: 'User UUID' })
    @ApiResponse({ status: 200, description: 'User updated' })
    updateUser(@Param('id') id: string, @Body() body: Record<string, unknown>) {
        return this.gatewayService.updateUser(id, body);
    }

    @ApiTags('Users')
    @Public()
    @Delete('users/:id')
    @ApiOperation({ summary: 'Delete a user' })
    @ApiParam({ name: 'id', description: 'User UUID' })
    @ApiResponse({ status: 200, description: 'User deleted' })
    deleteUser(@Param('id') id: string) {
        return this.gatewayService.deleteUser(id);
    }
}
