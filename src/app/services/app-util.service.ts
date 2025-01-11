import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppUtilService {
  constructor() {}

  isEmpty(value: any) {
    if (Array.isArray(value)) {
      // Check if it's an array and is empty
      return value.length === 0;
    } else if (typeof value === 'object' && value !== null) {
      // Check if it's an object and has no keys
      return Object.keys(value).length === 0;
    } else {
      // For other data types, return true for undefined or null
      return !value;
    }
  }
}
