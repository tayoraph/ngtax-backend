import { Controller, Post, Body, Get, UsePipes, ValidationPipe, Param, Query, BadRequestException } from '@nestjs/common';
import { InsertTaxReformDto } from '../dto/dto/tax-reform.dto';
import { TaxReformService } from '../service/tax-reform.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CalculateTaxByCategoryDto } from '../dto/dto/calculateTaxByCategory.dto';
import { TaxCalculationByTaxNameRoleAndIncomeDto } from '../dto/dto/taxbyTaxnameRoleAndIncome.dto';
import { TaxCalculationByTagnameRoleaEntityndIncomeInput } from '../dto/dto/calcuatetaxByTagnameRoleIncomeAndEntity.dto';

@ApiTags('Tax')
@ApiBearerAuth()
@Controller('taxreform')
export class TaxReformController {
  constructor(private readonly service: TaxReformService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async insert(@Body() dto: InsertTaxReformDto):Promise<any> {
    return this.service.insertTaxData(dto);
  }

  @Get()
  async getAll() {
    
    let tax = this.service.getAll();
    return tax
  }

   @Get('category/:category')
  getByCategory(@Param('category') category: string) :Promise<any>{
    return this.service.getByCategory(category);
  }

  @Get('role/:role')
  getByRole(@Param('role') role: string) :Promise<any>{
    return this.service.getByRole(role);
  }

  @Get('tax/:taxCategory')
  getByTaxCategory(@Param('taxCategory') taxCategory: string) :Promise<any>{
    return this.service.getByTaxCategory(taxCategory);
  }



  //#region Get role array
   @Get('role')
  async getRoles() {
    return this.service.getAllRoles();
  }
//#endregion

//#region  get Tax By Role And Income

   @Get('getTaxByRoleAndIncome')
  async getTaxByRoleAndIncome(
    @Query('role') role: string,
    @Query('income') incomeStr: string,
  ) {
    const income = parseInt(incomeStr, 10);
    if (!role || isNaN(income)) {
      throw new BadRequestException('Provide valid "role" and numeric "income"');
    }

    return this.service.calculateTaxByRoleAndIncome(role, income);
  }

  //#endregion
  



  //#region  calculate exact tax to bepaid and not an estimate 
  // @Post('calculate')
  // async calculateTax(@Body() calculateTaxDto: CalculateTaxDto) {
  //   const { roleTitle, amount } = calculateTaxDto;
  //   return this.taxService.calculateTaxExactMatch(roleTitle, amount);
  // }

  //#endregion


  //#region calculate Tax By Tax Category 
  @Post('calculateByTaxCategory')
  //@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async calculate(@Body() dto: CalculateTaxByCategoryDto) {
    return this.service.calculateByTaxCategory(dto);
  }
  //#endregion

     //#region calculate tax by role, income and taxName 
  @Post('TaxCalculationByTaxNameRoleAndIncomeDto')
  async TaxCalculationByTaxNameRoleAndIncomeDto(@Body() dto: TaxCalculationByTaxNameRoleAndIncomeDto) {
    return await this.service.calculateTaxByRoleAndTaxnameAndIncome(dto);
  }
  //#endregion

       //#region calculate tax by role, income and taxName and entity
  @Post('TaxCalculationByTagnameRoleaEntityndIncomeInput')
  async TaxCalculationByTagnameRoleaEntityndIncomeInput(@Body() dto: TaxCalculationByTagnameRoleaEntityndIncomeInput) {
    return await this.service.calculateTaxByRoleAndTaxnameEntityAndIncome(dto);
  }
  //#endregion
  
}
