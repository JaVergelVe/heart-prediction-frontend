import { Injectable } from '@angular/core';
import { STORAGE_KEYS } from '../../../core/constants/storage-keys.constant';

@Injectable({
  providedIn: 'root'
})
export class AnonymousPredictionSessionService {
  getOrCreateSessionId(): string {
    if (typeof localStorage === 'undefined') {
      return crypto.randomUUID();
    }
    const key = STORAGE_KEYS.anonymousPredictionSessionId;
    const existing = localStorage.getItem(key);
    if (existing && existing.trim()) {
      return existing.trim();
    }
    const id = crypto.randomUUID();
    localStorage.setItem(key, id);
    return id;
  }
}
