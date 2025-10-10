import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { CreateLearnDto } from '../dto/create-learn.dto';
import { UpdateLearnDto } from '../dto/update-learn.dto';
import { Learn } from '../schema/learn.schema';
import { LearnService } from '../service/learn.service';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Learn')
@Controller('learn')
export class LearnController {
  constructor(private readonly learnService: LearnService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Create a Learn item', type: Learn })
  create(@Body() createLearnDto: CreateLearnDto): Promise<Learn> {
    return this.learnService.create(createLearnDto);
  }

  @Get()
  findAll(): Promise<Learn[]> {
    return this.learnService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Learn> {
    return this.learnService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLearnDto: UpdateLearnDto): Promise<Learn> {
    return this.learnService.update(id, updateLearnDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Learn> {
    return this.learnService.remove(id);
  }
}
