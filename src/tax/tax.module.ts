import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaxController } from './controller/tax.controller';
import { TaxCategory, TaxCategorySchema } from './schema/tax.schema';
import { TaxService } from './service/tax.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: TaxCategory.name, schema: TaxCategorySchema }])],
  controllers: [TaxController],
  providers: [TaxService],
})
export class TaxModule {}
