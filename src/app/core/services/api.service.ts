import { Injectable } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { snakeCase, camelCase } from 'voca';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor() {}

  static camelCaseToSnakeCase(input: string): string {
    return snakeCase(input);
  }

  static snakeCaseToCamelCase(input: string): string {
    return camelCase(input);
  }

  static encodeQueryData(data: {[key: string]: any}): string {
    const ret = [];
    for (const d of Object.keys(data)) {
      ret.push(encodeURIComponent(ApiService.camelCaseToSnakeCase(d)) + '=' + encodeURIComponent(data[d]));
    }

    return ret.join('&');
  }

  static createConverterFunction (keyConversionFun: (input: string) => string) {
    const convertObjectKeys = (obj: any) => {
        // Creates a new object mimicking the old one with keys changed using the keyConversionFun.
        // Does a deep conversion.
        if (ApiService.getClass(obj) !== 'Object' && ApiService.getClass(obj) !== 'Array') {
            return obj; // Primitives are returned unchanged.
        }

        return Object.keys(obj).reduce(function (newObj:{[key: string]: any}, key) {
            newObj[keyConversionFun(key)] = convertObjectKeys(obj[key]);
            return newObj;
        }, Array.isArray(obj) ? [] : {}); // preserve "arrayness"
    };

    return convertObjectKeys;
  }

  static getClass(obj: any): string {
      // Workaround for detecting native classes.
      // Examples:
      // getClass({}) === 'Object'
      // getClass([]) === 'Array'
      // getClass(function () {}) === 'Function'
      // getClass(new Date) === 'Date'
      // getClass(null) === 'Null'

      // Here we get a string like '[object XYZ]'
      const typeWithBrackets = Object.prototype.toString.call(obj);

      // and we extract 'XYZ' from it
      const matchResult = typeWithBrackets.match(/\[object (.+)\]/);
      return (matchResult ? matchResult[1] : 'Null');
  }

  gridEventToApi(params: LazyLoadEvent) {
    const newParams = {
      filters: params.filters,
      globalFilter: params.globalFilter,
      multiSortMeta: params.multiSortMeta,
      sortOrder: params.sortOrder,
      page: Math.round((params.first ? (params.first / (params.rows ? params.rows: 0)) + 1 : 1)),
      perPage: params.rows,
      sortField: (params.sortField ? ApiService.camelCaseToSnakeCase(params.sortField) : params.sortField)
    };

    return newParams;
  }
}
