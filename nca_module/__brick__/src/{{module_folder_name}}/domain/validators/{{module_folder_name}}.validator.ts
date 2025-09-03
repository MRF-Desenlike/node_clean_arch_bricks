import { ClassValidatorFields } from '@/shared/domain/validators/class-validator-fields'
import { {{module_name.pascalCase()}}Props } from '../entities/{{module_folder_name}}.entity'
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'

export class {{module_name.pascalCase()}}Rules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string

  @MaxLength(255)
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  password: string

  @IsDate()
  @IsOptional()
  createdAt?: Date

  constructor({ email, name, password, createdAt }: {{module_name.pascalCase()}}Props) {
    Object.assign(this, { email, name, password, createdAt })
  }
}

export class {{module_name.pascalCase()}}Validator extends ClassValidatorFields<{{module_name.pascalCase()}}Rules> {
  validate(data: {{module_name.pascalCase()}}Rules): boolean {
    return super.validate(new {{module_name.pascalCase()}}Rules(data ?? ({} as {{module_name.pascalCase()}}Props)))
  }
}

export class {{module_name.pascalCase()}}ValidatorFactory {
  static create(): {{module_name.pascalCase()}}Validator {
    return new {{module_name.pascalCase()}}Validator()
  }
}
