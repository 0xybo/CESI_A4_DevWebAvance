import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';

@Module({
    imports: [DatabaseModule],
    controllers: [BillingController],
    providers: [BillingService],
})
export class BillingModule {}
