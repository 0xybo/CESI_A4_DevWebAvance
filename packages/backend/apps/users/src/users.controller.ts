import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UsersService } from './users.service';

/** HTTP and RabbitMQ controller for users operations. */
@Controller()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    /** HTTP health-check endpoint. */
    @Get('health')
    getHealthHttp() {
        return { status: 'ok', service: 'users' };
    }

    /** RabbitMQ health-check handler. */
    @MessagePattern('health')
    getHealth() {
        return { status: 'ok', service: 'users' };
    }

    /** Create a Driver profile for the given user. */
    @Post('users/:id/driver')
    createDriver(@Param('id') id: string, @Body() body: { vehicle_id?: string; rating?: number }) {
        return this.usersService.createDriver(id, body);
    }

    /** Get the Driver profile for the given user. */
    @Get('users/:id/driver')
    getDriver(@Param('id') id: string) {
        return this.usersService.getDriver(id);
    }
}
