import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class GatewayService {
    constructor(
        @Inject('AUTH_SERVICE') private authClient: ClientProxy,
        @Inject('BILLING_SERVICE') private billingClient: ClientProxy,
        @Inject('STOCK_SERVICE') private stockClient: ClientProxy,
        @Inject('DELIVERY_SERVICE') private deliveryClient: ClientProxy,
        @Inject('USERS_SERVICE') private usersClient: ClientProxy,
    ) {}

    getHello(): string {
        return 'Hello World!';
    }

    async getGatewayHealth() {
        return { status: 'ok' };
    }

    async getAuthHealth() {
        try {
            return await firstValueFrom(
                this.authClient.send('health', {}).pipe(timeout(5000)),
            );
        } catch {
            return {
                status: 'error',
                service: 'auth',
                message: 'Service unreachable',
            };
        }
    }

    async getBillingHealth() {
        try {
            return await firstValueFrom(
                this.billingClient.send('health', {}).pipe(timeout(5000)),
            );
        } catch {
            return {
                status: 'error',
                service: 'billing',
                message: 'Service unreachable',
            };
        }
    }

    async getStockHealth() {
        try {
            return await firstValueFrom(
                this.stockClient.send('health', {}).pipe(timeout(5000)),
            );
        } catch {
            return {
                status: 'error',
                service: 'stock',
                message: 'Service unreachable',
            };
        }
    }

    async getDeliveryHealth() {
        try {
            return await firstValueFrom(
                this.deliveryClient.send('health', {}).pipe(timeout(5000)),
            );
        } catch {
            return {
                status: 'error',
                service: 'delivery',
                message: 'Service unreachable',
            };
        }
    }

    async getUsersHealth() {
        try {
            return await firstValueFrom(
                this.usersClient.send('health', {}).pipe(timeout(5000)),
            );
        } catch {
            return {
                status: 'error',
                service: 'users',
                message: 'Service unreachable',
            };
        }
    }
}
