import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { IngredientTypesService } from './ingredient-types.service';
import { CreateIngredientTypeDto } from './dto/create-ingredient-type.dto';
import { UpdateIngredientTypeDto } from './dto/update-ingredient-type.dto';

@Controller('ingredient-types')
export class IngredientTypesController {
  constructor(private readonly service: IngredientTypesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() dto: CreateIngredientTypeDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateIngredientTypeDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
