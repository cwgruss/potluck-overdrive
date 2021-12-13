import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import {
  IRecipeRepository,
  RecipeRepository,
} from './repository/recipe.repository';

@Module({
  controllers: [RecipesController],
  providers: [
    {
      provide: IRecipeRepository,
      useClass: RecipeRepository,
    },
    RecipesService,
  ],
})
export class RecipesModule {}
