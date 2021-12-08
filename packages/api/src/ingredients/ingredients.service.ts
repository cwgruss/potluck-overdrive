import { Injectable } from '@nestjs/common';
import { Result } from 'src/core/monads/result';
import { Ingredient } from './domain/ingredient.model';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { IIngredientRepository } from './repository/ingredient.repository';

@Injectable()
export class IngredientsService {
  constructor(private _ingredientRepository: IIngredientRepository) {}

  async create(createIngredientDto: CreateIngredientDto) {
    const { label, description, priority } = createIngredientDto;

    const ingredientOrError = Ingredient.create({
      label,
      description,
      priority,
    });

    if (ingredientOrError.isFail()) {
      return Result.fail(ingredientOrError.unwrapFail());
    }

    const ingredient: Ingredient = ingredientOrError.unwrap();

    const ingredientAlreadyExists = await this._ingredientRepository.exists(
      ingredient.keyValue,
    );

    if (ingredientAlreadyExists) {
      return `Ingredient ${ingredient.label} already exists.`;
    }

    try {
      await this._ingredientRepository.save(ingredient);
    } catch (error) {
      console.error(error);
      return error;
    }

    return Result.ok('Ingredient Created');
  }

  findAll() {
    return this._ingredientRepository.findAllIngredients();
  }

  findOne(id: number) {
    return `This action returns a #${id} ingredient`;
  }

  update(id: number, updateIngredientDto: UpdateIngredientDto) {
    return `This action updates a #${id} ingredient`;
  }

  remove(id: number) {
    return `This action removes a #${id} ingredient`;
  }
}
