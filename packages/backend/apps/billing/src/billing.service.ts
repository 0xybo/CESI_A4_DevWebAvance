import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/database';

@Injectable()
export class BillingService {
    constructor(private readonly prisma: PrismaService) {}
}
