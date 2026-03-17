import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AdminHeader } from './admin-header';
import { selectUser } from '../../../store/auth/auth.selectors';
import { User } from '../../../type/types';

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 1, name: 'Juan', surname: 'García', username: 'jgarcia',
    email: 'j@g.com', phone: '600', roleName: 'ROLE_ADMIN',
    profileImageUrl: '', createdAt: '', active: true, verified: true,
    addresses: [], ...overrides,
  };
}

describe('AdminHeader', () => {
  let component: AdminHeader;
  let fixture: ComponentFixture<AdminHeader>;
  let store: MockStore;

  const initialAuthState = {
    auth: { token: null, user: null, loading: false, error: null, refreshToken: null },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminHeader, TranslateModule.forRoot()],
      providers: [
        provideMockStore({ initialState: initialAuthState }),
        provideRouter([]),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectUser, null);
    fixture = TestBed.createComponent(AdminHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit toggleSidebar when onToggle is called', () => {
    const emitSpy = spyOn(component.toggleSidebar, 'emit');
    component.onToggle();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should compute userInitials from name and surname', () => {
    store.overrideSelector(selectUser, makeUser({ name: 'Juan', surname: 'García' }));
    store.refreshState();
    fixture.detectChanges();

    expect(component.userInitials()).toBe('JG');
  });

  it('should return empty initials when user is null', () => {
    store.overrideSelector(selectUser, null);
    store.refreshState();
    fixture.detectChanges();

    expect(component.userInitials()).toBe('');
  });
});
