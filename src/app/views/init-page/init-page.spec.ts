import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InitPage } from './init-page';
import { LanguageService } from '../../services/language-service';

describe('InitPage', () => {
  let component: InitPage;
  let fixture: ComponentFixture<InitPage>;
  let router: Router;
  let languageService: jasmine.SpyObj<LanguageService>;

  beforeEach(async () => {
    const languageServiceSpy = jasmine.createSpyObj('LanguageService', ['tMany']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [InitPage, TranslateModule.forRoot()],
      providers: [
        { provide: LanguageService, useValue: languageServiceSpy },
        { provide: Router, useValue: routerSpy },
        TranslateService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InitPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    languageService = TestBed.inject(LanguageService) as jasmine.SpyObj<LanguageService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default hero background image', () => {
    expect(component.heroBackgroundImage).toBeTruthy();
    expect(component.heroBackgroundImage).toContain('https://');
  });

  it('should load translations on init', async () => {
    const mockTranslations = {
      'home.banner.title': 'Title',
      'home.banner.subtitle': 'Subtitle',
      'home.banner.button1': 'Button 1',
      'home.banner.button2': 'Button 2',
    };
    languageService.tMany.and.returnValue(Promise.resolve(mockTranslations));

    await component.ngOnInit();

    expect(languageService.tMany).toHaveBeenCalledWith([
      'home.banner.title',
      'home.banner.subtitle',
      'home.banner.button1',
      'home.banner.button2',
    ]);
    expect(component.t).toEqual(mockTranslations);
  });

  it('should navigate to shop when navigateToShop is called', () => {
    component.navigateToShop();
    expect(router.navigate).toHaveBeenCalledWith(['/shop']);
  });

  it('should navigate to about when navigateToAbout is called', () => {
    component.navigateToAbout();
    expect(router.navigate).toHaveBeenCalledWith(['/about']);
  });

  it('should navigate to contact when navigateToContact is called', () => {
    component.navigateToContact();
    expect(router.navigate).toHaveBeenCalledWith(['/contact']);
  });

  it('should navigate to register when navigateToRegister is called', () => {
    component.navigateToRegister();
    expect(router.navigate).toHaveBeenCalledWith(['/register']);
  });
});
