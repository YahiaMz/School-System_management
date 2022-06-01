import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';

@Module({
  providers: [AdminService],
  controllers: [AdminController] ,
  imports : [TypeOrmModule.forFeature([Admin])] ,
  exports : [AdminService]
})
export class AdminModule {

  
}
