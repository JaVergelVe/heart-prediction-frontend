import { Injectable } from '@angular/core';
import { STORAGE_KEYS } from '../../../core/constants/storage-keys.constant';

@Injectable({
  providedIn: 'root'
})
export class AnonymousPredictionSessionService {
  getOrCreateSessionId(): string {
    if (typeof localStorage === 'undefined') {
      return this.generateSessionId();
    }
    const key = STORAGE_KEYS.anonymousPredictionSessionId;
    const existing = localStorage.getItem(key);
    if (existing && existing.trim()) {
      return existing.trim();
    }
    const id = this.generateSessionId();
    localStorage.setItem(key, id);
    return id;
  }

  private generateSessionId(): string {
    const webCrypto = globalThis.crypto;
    if (typeof webCrypto?.randomUUID === 'function') {
      return webCrypto.randomUUID();
    }

    if (typeof webCrypto?.getRandomValues === 'function') {
      const bytes = new Uint8Array(16);
      webCrypto.getRandomValues(bytes);
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;
      const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'));
      return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`;
    }

    return `sid-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}
