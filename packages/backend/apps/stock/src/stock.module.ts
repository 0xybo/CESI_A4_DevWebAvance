import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';

@Module({
    imports: [DatabaseModule],
    controllers: [StockController],
    providers: [StockService],
})
export class StockModule {}
