import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SaleService } from './sale.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { My_Helper } from 'src/MY-HELPER-CLASS';

@Controller('sale')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post('/create')
  async create(@Body() createSaleDto: CreateSaleDto) {
    let newSale = await this.saleService.create(createSaleDto);
    return My_Helper.SUCCESS_RESPONSE(newSale);
  }

  @Get('/all')
 async findAll() {
    let sales = await this.saleService.findAll();
    return My_Helper.SUCCESS_RESPONSE(sales);
  }

  @Get('/allOfType/:roomType')
  async findAllOfType(@Param('roomType') roomType : string) {
    console.log(roomType);

    let roomTypes : string[] = ["TD" ,"TP" , "AMPHI"];
    
    if(!roomTypes.find(roomT => roomT === roomType) ) {
             return My_Helper.FAILED_RESPONSE('roomType must be in [TD , TP, AMPHI]');
    } 
     let rooms = await this.saleService.findAllStudyRoomOfType(roomType);
     return My_Helper.SUCCESS_RESPONSE(rooms);
   }


  @Get('/allInZone/:zone')
  async findAllInZone(@Param('zone') roomArea : string) {

    console.log(roomArea);
    let areas : string[] = ["CPI", "CS"];

    if(!areas.find(area => area === roomArea)) {
             return My_Helper.FAILED_RESPONSE('room Area must be one of the following  values : {CS , CPI}');
    } 
     let rooms = await this.saleService.findAllStudyRoomInArea(roomArea);
     return My_Helper.SUCCESS_RESPONSE(rooms);
   }



  @Patch('/update/:id')
  async update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto) {
    let updatedSale = await this.saleService.update( +id , updateSaleDto);
    return My_Helper.SUCCESS_RESPONSE(updatedSale);
    }

  @Delete('/delete/:id')
 async remove(@Param('id') id: string) {
    await this.saleService.remove(+id)
    return My_Helper.SUCCESS_RESPONSE('sale removed with success');
  }

  @Get('/availableSales/day=:day&time=:time')
  async getAvailableSales ( @Param('day') day : string , @Param('time') time : string ) { 

    let availableSales = await this.saleService.getAvailableSales(+day , time);
    return My_Helper.SUCCESS_RESPONSE(availableSales);
  }

}
