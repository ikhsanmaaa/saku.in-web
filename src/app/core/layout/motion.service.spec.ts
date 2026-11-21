import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { MotionService } from './motion.service';

describe('MotionService', () => {
  beforeEach(() => {
    localStorage.removeItem('sakuin_motion');
    document.documentElement.removeAttribute('data-motion');
  });

  it('should default to active and set data-motion attribute when no preference is stored', () => {
    TestBed.configureTestingModule({});
    const motionService = TestBed.inject(MotionService);
    const documentReference = TestBed.inject(DOCUMENT);

    expect(motionService.preference()).toBe('active');
    expect(motionService.isPaused()).toBe(false);
    expect(documentReference.documentElement.getAttribute('data-motion')).toBe('active');
  });

  it('should toggle between active and paused and persist to localStorage', () => {
    TestBed.configureTestingModule({});
    const motionService = TestBed.inject(MotionService);
    const documentReference = TestBed.inject(DOCUMENT);

    motionService.toggle();
    expect(motionService.isPaused()).toBe(true);
    expect(localStorage.getItem('sakuin_motion')).toBe('paused');
    expect(documentReference.documentElement.getAttribute('data-motion')).toBe('paused');

    motionService.toggle();
    expect(motionService.isPaused()).toBe(false);
    expect(localStorage.getItem('sakuin_motion')).toBe('active');
    expect(documentReference.documentElement.getAttribute('data-motion')).toBe('active');
  });

  it('should restore paused preference from localStorage on initialization', () => {
    localStorage.setItem('sakuin_motion', 'paused');
    TestBed.configureTestingModule({});
    const motionService = TestBed.inject(MotionService);

    expect(motionService.isPaused()).toBe(true);
    expect(document.documentElement.getAttribute('data-motion')).toBe('paused');
  });
});
