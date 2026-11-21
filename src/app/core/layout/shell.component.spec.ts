import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ShellComponent } from './shell.component';

describe('ShellComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShellComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should render main landmark and router outlet when initialized', async () => {
    const fixture = TestBed.createComponent(ShellComponent);
    await fixture.whenStable();

    const compiledElement = fixture.nativeElement as HTMLElement;
    const mainElement = compiledElement.querySelector('main#sp-page-main');
    const routerOutlet = compiledElement.querySelector('router-outlet');

    expect(mainElement).not.toBeNull();
    expect(routerOutlet).not.toBeNull();
  });
});
