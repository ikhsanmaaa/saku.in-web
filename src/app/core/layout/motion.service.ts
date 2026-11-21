import { DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';

export type MotionPreference = 'active' | 'paused';

const MOTION_STORAGE_KEY = 'sakuin_motion';

@Injectable({ providedIn: 'root' })
export class MotionService {
  private readonly documentReference = inject(DOCUMENT);
  private readonly preferenceSignal = signal<MotionPreference>(this.readInitialPreference());

  readonly preference = this.preferenceSignal.asReadonly();
  readonly isPaused = computed(() => this.preferenceSignal() === 'paused');

  constructor() {
    this.applyPreference(this.preferenceSignal());
  }

  toggle(): void {
    const nextPreference: MotionPreference = this.isPaused() ? 'active' : 'paused';
    this.setPreference(nextPreference);
  }

  setPreference(nextPreference: MotionPreference): void {
    this.preferenceSignal.set(nextPreference);
    this.applyPreference(nextPreference);
    try {
      localStorage.setItem(MOTION_STORAGE_KEY, nextPreference);
    } catch {
      // Ignore storage quota or private browsing errors
    }
  }

  private readInitialPreference(): MotionPreference {
    try {
      const storedValue = localStorage.getItem(MOTION_STORAGE_KEY);
      if (storedValue === 'paused' || storedValue === 'active') {
        return storedValue;
      }
    } catch {
      // Ignore storage access errors
    }

    if (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return 'paused';
    }

    return 'active';
  }

  private applyPreference(preference: MotionPreference): void {
    this.documentReference.documentElement.setAttribute('data-motion', preference);
  }
}
