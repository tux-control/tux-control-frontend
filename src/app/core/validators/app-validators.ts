import { AbstractControl, ValidatorFn } from '@angular/forms';

export class AppValidators {

  static get notZeroNumber(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return control.value === 0 && control.value !== undefined ? { 'invalidNotZeroNumber': { value: control.value } } : null;
    };
  }

  static get urlValidator(): ValidatorFn {
    const urlRegex = /^(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)$/i;
    return (control: AbstractControl): { [key: string]: any } | null => {
      const forbidden = !urlRegex.test(control.value);
      return forbidden && control.value ? { 'invalidUrl': { value: control.value } } : null;
    };
  }

  static get floatValidator(): ValidatorFn {
    const floatRegex = /^[-+]?\d*\.?\d*$/;
    return (control: AbstractControl): { [key: string]: any } | null => {
      const forbidden = !floatRegex.test(control.value);
      return forbidden && control.value ? { 'invalidFloat': { value: control.value } } : null;
    };
  }

  static passwordValidator(minLevel: string): ValidatorFn {
    const levels: {[s: string]: (score: number) => boolean} = {
      'weak': (score: number) => (score < 30),
      'medium': (score: number) => (score >= 30),
      'strong': (score: number) => (score >= 80)
    };

    if (!(minLevel in levels)) {
      throw Error('Unknown password level' + minLevel);
    }

    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value === null) {
        return null;
      }
  
      return !levels[minLevel](this.testStrength(control.value)) && control.value ? { 'invalidPasswordLevel': { value: control.value } } : null;
    };
  }

  static testStrength(str: string) {
        let grade: number = 0;
        let val: any;

        val = str.match('[0-9]');
        grade += this.normalize(val ? val.length : 1 / 4, 1) * 25;

        val = str.match('[a-zA-Z]');
        grade += this.normalize(val ? val.length : 1 / 2, 3) * 10;

        val = str.match('[!@#$%^&*?_~.,;=]');
        grade += this.normalize(val ? val.length : 1 / 6, 1) * 35;

        val = str.match('[A-Z]');
        grade += this.normalize(val ? val.length : 1 / 6, 1) * 30;

        grade *= str.length / 8;

        return grade > 100 ? 100 : grade;
    }

    static normalize(x: number, y: number) {
        const diff = x - y;

        if (diff <= 0) {
          return x / y;
        } else {
          return 1 + 0.5 * (x / (x + y / 4));
        }
    }

}
