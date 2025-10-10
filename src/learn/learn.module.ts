import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Learn, LearnSchema } from './schema/learn.schema';
import { LearnController } from './controller/learn.controller';
import { LearnService } from './service/learn.service';

@Module({
imports: [MongooseModule.forFeature([{ name: Learn.name, schema: LearnSchema }])],
  controllers: [LearnController],
  providers: [LearnService],
})
export class LearnModule {}
