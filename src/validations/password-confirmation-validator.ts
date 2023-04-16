import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'passwordConfirmation', async: false })
export class PasswordConfirmationValidator
  implements ValidatorConstraintInterface
{
  validate(confirmPassword: string, args: ValidationArguments) {
    const object = args.object as any;
    return object.password === confirmPassword;
  }

  defaultMessage() {
    return 'Password and confirmation password do not match';
  }
}

export function IsPasswordConfirmationMatch(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'isPasswordConfirmationMatch',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: PasswordConfirmationValidator,
    });
  };
}
