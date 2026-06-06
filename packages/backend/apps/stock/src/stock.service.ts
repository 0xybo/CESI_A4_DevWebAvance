import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/database';

@Injectable()
export class StockService {
    constructor(private readonly prisma: PrismaService) {}
}
