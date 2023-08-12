import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {
  get<T>(key: string) {
    const item = JSON.parse(localStorage.getItem(key));

    if (!item) {
      return null;
    }

    return item;
  }

  set<T>(key: string, data: T) {
    localStorage.setItem(key, JSON.stringify(data));
  }
}
