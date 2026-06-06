import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class GatewayService {
    private readonly serviceUrls = {
        auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
        billing: process.env.BILLING_SERVICE_URL || 'http://localhost:3002',
        delivery: process.env.DELIVERY_SERVICE_URL || 'http://localhost:3003',
        stock: process.env.STOCK_SERVICE_URL || 'http://localhost:3004',
        users: process.env.USERS_SERVICE_URL || 'http://localhost:3005',
    };

    private async fetchHealth(service: string, baseUrl: string) {
        try {
            const response = await fetch(`${baseUrl}/health`, {
                signal: AbortSignal.timeout(5000),
            });
            return await response.json();
        } catch {
            throw new HttpException(
                { status: 'error', service, message: 'Service unreachable' },
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }

    getHello(): string {
        return 'Hello World!';
    }

    async getGatewayHealth() {
        return { status: 'ok' };
    }

    async getAuthHealth() {
        return this.fetchHealth('auth', this.serviceUrls.auth);
    }

    async getBillingHealth() {
        return this.fetchHealth('billing', this.serviceUrls.billing);
    }

    async getStockHealth() {
        return this.fetchHealth('stock', this.serviceUrls.stock);
    }

    async getDeliveryHealth() {
        return this.fetchHealth('delivery', this.serviceUrls.delivery);
    }

    async getUsersHealth() {
        return this.fetchHealth('users', this.serviceUrls.users);
    }
}
