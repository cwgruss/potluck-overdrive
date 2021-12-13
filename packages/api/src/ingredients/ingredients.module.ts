import { Module } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { IngredientsController } from './ingredients.controller';
import {
  IIngredientRepository,
  IngredientRepository,
} from './repository/ingredient.repository';

@Module({
  controllers: [IngredientsController],
  providers: [
    {
      provide: IIngredientRepository,
      useClass: IngredientRepository,
    },
    IngredientsService,
  ],
})
export class IngredientsModule {}
