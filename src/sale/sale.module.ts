import { Module } from '@nestjs/common';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';

@Module({
  controllers: [SaleController],
  providers: [SaleService] , 
  imports : [TypeOrmModule.forFeature([Sale]) ] , 
  exports : [SaleService]
})
export class SaleModule {}
