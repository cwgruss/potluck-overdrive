import { Injectable } from '@nestjs/common';
import { Result } from 'src/core/monads/result';
import { EmailAddress } from './domain/email-address.model';
import { User } from './domain/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUserRepository } from './repository/user.repository';

@Injectable()
export class UsersService {
  constructor(private _userRepository: IUserRepository) {}

  async create(createUserDto: CreateUserDto) {
    const { firstName, lastName, displayName } = createUserDto;

    const emailOrError = EmailAddress.create(createUserDto.emailAddress);

    const userOrError = User.create({
      displayName,
      emailAddress: emailOrError.unwrap(),
      firstName,
      lastName,
      isEmailVerified: false,
      role: 'contributor',
      dateJoined: new Date(),
      dateLastSignedOn: new Date(),
    });

    if (userOrError.isFail()) {
      return Result.fail(userOrError.unwrapFail());
    }

    const user: User = userOrError.unwrap();

    const userAlreadyExists = await this._userRepository.exists(
      user.emailAddress,
    );

    if (userAlreadyExists) {
      return `User with email address ${user.emailAddress.value} already exists.`;
    }

    try {
      await this._userRepository.save(user);
    } catch (error) {
      console.error(error);
      return error;
    }

    return Result.ok('success!');
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
