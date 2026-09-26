import { Module } from '@nestjs/common';
import { IngredientTypesController } from './ingredient-types.controller';
import { IngredientTypesService } from './ingredient-types.service';

@Module({
  controllers: [IngredientTypesController],
  providers: [IngredientTypesService],
})
export class IngredientTypesModule {}
