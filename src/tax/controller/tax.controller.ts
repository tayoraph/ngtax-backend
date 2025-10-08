import { Controller, Get, Post, Body, UseGuards, Param, Patch, Delete, Logger } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt/auth.guard/jwt.auth.guard';
import { CalculateTaxDto } from '../dto/dto/calculate-tax.dto';
import { TaxService } from '../service/tax.service';
import { CreateTaxCategoryDto } from '../dto/create-tax-category.dto';
import { UpdateTaxCategoryDto } from '../dto/update-tax-category.dto';
import { FileLogger } from '../../common/logger/file-logger.service';

@ApiTags('Tax')
@ApiBearerAuth()
@Controller('tax')
export class TaxController {
  constructor(private readonly taxService: TaxService ) {}

 
    @ApiOperation({ summary: 'Get all tax categories' })
    @Get()
    getAll() :Promise<any>{
      return this.taxService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Calculate tax for a category' })
    @Post('calculate')
    calculate(@Body() dto: CalculateTaxDto):Promise<any> {
      return this.taxService.calculateTax(dto);
    }

    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Add a new tax category' })
    @Post('add-category')
    addCategory(@Body() dto: CreateTaxCategoryDto):Promise<any> {
    return this.taxService.createCategory(dto);
    }

    /**
     * Update tax category 
     * called by PATCH /tax/update-category/:id
     * sample request json payload 
     *      {
            "name": "Personal Income Tax",
            "rate": 0.1
            }
     */
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Update an existing tax category by ID' }) 

    @Patch('update-category/:id')
    updateCategory(@Param('id') id: string, @Body() dto: UpdateTaxCategoryDto):Promise<any> {
    return this.taxService.updateCategory(id, dto);
    }


    /**
     * Delete tax Category 
     * called by DELETE /tax/delete-category/:id

     */
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Delete a tax category by ID' })
    @Delete('delete-category/:id')
    deleteCategory(@Param('id') id: string) :Promise<any>{
    return this.taxService.deleteCategory(id);
    }
}
