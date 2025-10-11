import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaxController } from './controller/tax.controller';
import { TaxCategory, TaxCategorySchema } from './schema/tax.schema';
import { TaxService } from './service/tax.service';
import { TaxReform, TaxReformSchema } from './schema/tax-reform.schema';
import { TaxReformService } from './service/tax-reform.service';
import { TaxReformController } from './controller/tax-reform.controller';
import { LoggerService } from '../shared/logger/loggerService';

@Module({
  imports: [MongooseModule.forFeature([{ name: TaxCategory.name, schema: TaxCategorySchema },{ name: TaxReform.name, schema: TaxReformSchema }])],
  controllers: [TaxController,TaxReformController],
  providers: [TaxService,TaxReformService,LoggerService],
  exports: [TaxReformService]
})
export class TaxModule {}
