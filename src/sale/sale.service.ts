import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { async } from 'rxjs';
import { My_Helper } from 'src/MY-HELPER-CLASS';
import { Repository } from 'typeorm';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Sale } from './entities/sale.entity';

@Injectable()
export class SaleService {

  constructor(@InjectRepository(Sale) private saleRepository : Repository<Sale> ) { }

  async create(createSaleDto: CreateSaleDto) {
    try {
       let sale = this.saleRepository.create({ 
        name : createSaleDto.name,
        capacity : createSaleDto.capacity ,
        hasDataShow : createSaleDto.hasDataShow
      });

      let newSale  = await this.saleRepository.save(sale);
      return newSale;
    } catch (error) {
      throw new HttpException( My_Helper.FAILED_RESPONSE('sale name must be unique') , 201)
    }

  }

  async findAll() {
   try {
     let sales = await this.saleRepository.find();
     return sales;
   } catch (error) {
    throw new HttpException( My_Helper.FAILED_RESPONSE('something wrong') , 201)
   }

  }


  public async findSaleByIdOrThrowExp ( id :number) {
    try {
      let sale = await this.saleRepository.findOne({id : id});
      if (sale) return sale;
    } catch (error) {
      throw new HttpException(My_Helper.FAILED_RESPONSE('something wrong') , 201);
    }
    throw new HttpException(My_Helper.FAILED_RESPONSE('sale not found') , 201);
   }

  async update(id: number, updateSaleDto: UpdateSaleDto) {
    let sale = await this.findSaleByIdOrThrowExp(id);    
          Object.assign(sale , updateSaleDto);

    try {
          return await this.saleRepository.save(sale);
        } catch (error) {
          throw new HttpException(My_Helper.FAILED_RESPONSE('sale name Exist') , 201);
        }


    }



   async remove(id: number) {
    let sale = await this.findSaleByIdOrThrowExp(id);
    try {
           return await this.saleRepository.remove(sale);
          } catch (error) {
          throw new HttpException(My_Helper.FAILED_RESPONSE('something wrong') , 201);
        }

  }

  async getAvailableSales ( day : number ,time : string ) { 

    console.log(time);
    
  
    try {
   
      let availableSales = await this.saleRepository.query(`
      SELECT * FROM sale s where s.id NOT IN
      (SELECT DISTINCT l.sale_Id  FROM lesson l where l.day = ${day} and 
      "${time.toString()}" BETWEEN l.startingTime and l.endingTime );
      `);
  
  
  
      return availableSales;
    } catch (error) {
        console.log(error.message);
        
      throw new HttpException( My_Helper.FAILED_RESPONSE('something wrong !') , 201);
    
    }
   
  }
  


}
