import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/database';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}
}
