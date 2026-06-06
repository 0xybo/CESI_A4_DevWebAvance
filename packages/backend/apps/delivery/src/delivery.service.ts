import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/database';

@Injectable()
export class DeliveryService {
    constructor(private readonly prisma: PrismaService) {}
}
