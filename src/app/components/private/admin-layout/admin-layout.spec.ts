import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AdminLayout } from './admin-layout';
import { selectUser } from '../../../store/auth/auth.selectors';

describe('AdminLayout', () => {
  let component: AdminLayout;
  let fixture: ComponentFixture<AdminLayout>;

  const initialAuthState = {
    auth: { token: null, user: null, loading: false, error: null, refreshToken: null },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLayout, TranslateModule.forRoot()],
      providers: [
        provideMockStore({
          initialState: initialAuthState,
          selectors: [{ selector: selectUser, value: null }],
        }),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with sidebar expanded and mobile drawer closed', () => {
    expect(component.sidebarCollapsed()).toBeFalse();
    expect(component.mobileSidebarOpen()).toBeFalse();
  });

  it('should collapse sidebar on desktop toggle', () => {
    spyOnProperty(window, 'innerWidth', 'get').and.returnValue(1280);
    component.onToggleSidebar();
    expect(component.sidebarCollapsed()).toBeTrue();
    component.onToggleSidebar();
    expect(component.sidebarCollapsed()).toBeFalse();
  });

  it('should open mobile sidebar on mobile toggle', () => {
    spyOnProperty(window, 'innerWidth', 'get').and.returnValue(375);
    component.onToggleSidebar();
    expect(component.mobileSidebarOpen()).toBeTrue();
  });

  it('should close mobile sidebar on overlay click', () => {
    component.mobileSidebarOpen.set(true);
    component.onOverlayClick();
    expect(component.mobileSidebarOpen()).toBeFalse();
  });
});
