import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';

const validateRUT = (rut: string): boolean => {
  if (!rut || typeof rut !== 'string') return false;

  if (!/^(\d{1,2}\.\d{3}\.\d{3}-[\dkK])$/.test(rut)) {
    return false;
  }

  const rutLimpio = rut.replace(/[^0-9kK]/g, '');

  if (rutLimpio.length < 2) return false;

  const body = rutLimpio.slice(0, -1);
  const dv = rutLimpio.slice(-1).toUpperCase();

  if (!/^\d+$/.test(body)) return false;

  let suma = 0;
  let multiplicador = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    suma += parseInt(body.charAt(i)) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = 11 - (suma % 11);
  
  let dvCalculado = 'K';
  if (resto === 11) dvCalculado = '0';
  else if (resto !== 10) dvCalculado = resto.toString();

  return dv === dvCalculado;
};

@ValidatorConstraint({ name: 'IsRUT', async: false })
export class RutConstraint implements ValidatorConstraintInterface {
  validate(rut: string, args: ValidationArguments): boolean {
    return validateRUT(rut);
  }

  defaultMessage(args: ValidationArguments): string {
    return 'El RUT debe ser válido y tener el formato xx.xxx.xxx-x';
  }
}

export function IsRUT(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: RutConstraint,
    });
  };
}