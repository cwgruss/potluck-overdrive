import { Injectable } from '@nestjs/common';
import { Recipe } from './domain/recipe.model';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { IRecipeRepository } from './repository/recipe.repository';

@Injectable()
export class RecipesService {
  constructor(private _recipeRepository: IRecipeRepository) {}

  async create(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    const recipe =
      await this._recipeRepository.createRecipeWithRandomIngredients(4);
    return recipe;
  }

  findAll() {
    return `This action returns all recipes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} recipe`;
  }

  update(id: number, updateRecipeDto: UpdateRecipeDto) {
    return `This action updates a #${id} recipe`;
  }

  remove(id: number) {
    return `This action removes a #${id} recipe`;
  }
}
