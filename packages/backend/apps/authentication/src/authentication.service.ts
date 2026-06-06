import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/database';

@Injectable()
export class AuthenticationService {
    constructor(private readonly prisma: PrismaService) {}
}
