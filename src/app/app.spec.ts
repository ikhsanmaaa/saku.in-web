import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app when initialized', () => {
    const fixture = TestBed.createComponent(App);
    const application = fixture.componentInstance;
    expect(application).toBeTruthy();
  });

  it('should render router outlet when initialized', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiledElement = fixture.nativeElement as HTMLElement;
    expect(compiledElement.querySelector('router-outlet')).not.toBeNull();
  });
});
