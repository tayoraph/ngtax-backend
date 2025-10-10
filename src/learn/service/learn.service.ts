import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLearnDto } from '../dto/create-learn.dto';
import { UpdateLearnDto } from '../dto/update-learn.dto';
import { Learn, LearnDocument } from '../schema/learn.schema';

@Injectable()
export class LearnService {
  constructor(@InjectModel(Learn.name) private learnModel: Model<LearnDocument>) {}

  async create(createLearnDto: CreateLearnDto): Promise<Learn> {
    const learn = new this.learnModel(createLearnDto);
    return learn.save();
  }

  async findAll(): Promise<Learn[]> {
    return this.learnModel.find().exec();
  }

  async findOne(id: string): Promise<Learn> {
    const learn = await this.learnModel.findById(id).exec();
    if (!learn) throw new NotFoundException(`Learn item #${id} not found`);
    return learn;
  }

  async update(id: string, updateLearnDto: UpdateLearnDto): Promise<Learn> {
    const updated = await this.learnModel.findByIdAndUpdate(id, updateLearnDto, { new: true }).exec();
    if (!updated) throw new NotFoundException(`Learn item #${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<Learn> {
    const deleted = await this.learnModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException(`Learn item #${id} not found`);
    return deleted;
  }
}
