import { Controller, Get } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AuthenticationController {
    constructor(
        private readonly authenticationService: AuthenticationService,
    ) {}

    @Get('health')
    getHealthHttp() {
        return { status: 'ok', service: 'authentication' };
    }

    @MessagePattern('health')
    getHealth() {
        return { status: 'ok', service: 'authentication' };
    }
}
