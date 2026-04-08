import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';

export class FormUtils {
  // Expresiones regulares
  static emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
  static notOnlySpacesPattern = '^.*\\S.*$';
  static upperAndLowerPattern = '^(?=.*[a-z])(?=.*[A-Z]).*$';
  static hasNumberPattern = '^.*[0-9].*$';
  static hasSpecialPattern = '^.*[!@#$%^&*(),.?":{}|<>\\-_=+\\[\\]\\\\/;\'`~].*$';
  static dominicanPhonePattern = '^(809|829|849)\\d{7}$';

  static getTextError(errors: ValidationErrors) {
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';

        case 'minlength':
          return `Mínimo de ${errors['minlength'].requiredLength} caracteres.`;

        case 'min':
          return `Valor mínimo de ${errors['min'].min}`;

        case 'email':
          return `El valor ingresado no es un correo electrónico`;

        case 'pattern':
          switch (errors['pattern'].requiredPattern) {
            case FormUtils.emailPattern:
              return 'Debes ingresar un correo electrónico';
            case FormUtils.upperAndLowerPattern:
              return 'Debes ingresar una mayúscula y minúscula';
            case FormUtils.notOnlySpacesPattern:
              return 'No puedes ingresar solo espacios';
            case FormUtils.hasNumberPattern:
              return 'Debes ingresar al menos un número';
            case FormUtils.hasSpecialPattern:
              return 'Debes ingresar al menos un carácter especial';
            case FormUtils.dominicanPhonePattern:
              return 'Debes ingresar un número de teléfono dominicano válido';
            default:
              return 'Error de patrón contra expresión regular';
          }

        default:
          return `Error de validación no controlado ${key}`;
      }
    }

    return null;
  }

  static isValidField(form: FormGroup, fieldName: string): boolean | null {
    return (
      !!form.controls[fieldName].errors && form.controls[fieldName].touched
    );
  }

  static getFieldError(form: FormGroup, fieldName: string): string | null {
    if (!form.controls[fieldName]) return null;

    const errors = form.controls[fieldName].errors ?? {};

    return FormUtils.getTextError(errors);
  }

  static isValidFieldInArray(formArray: FormArray, index: number) {
    return (
      formArray.controls[index].errors && formArray.controls[index].touched
    );
  }

  static getFieldErrorInArray(
    formArray: FormArray,
    index: number
  ): string | null {
    if (formArray.controls.length === 0) return null;

    const errors = formArray.controls[index].errors ?? {};

    return FormUtils.getTextError(errors);
  }

  static arePasswordsEqual(passwordField: string, confirmPasswordField: string) {
    return (formGroup: AbstractControl) => {
      const passwordValue = formGroup.get(passwordField)?.value;
      const confirmPasswordValue = formGroup.get(confirmPasswordField)?.value;

      return passwordValue === confirmPasswordValue ? null : { passwordsNotEqual: true };
    };
  }
}
