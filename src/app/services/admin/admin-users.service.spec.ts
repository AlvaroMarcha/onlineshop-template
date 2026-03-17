import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminUsersService } from './admin-users.service';
import { environment } from '../../../environments/environment';
import { BannedUserResponse, Page, UserAdmin } from '../../type/admin-types';

describe('AdminUsersService', () => {
  let service: AdminUsersService;
  let httpMock: HttpTestingController;

  const api = environment.urls.usersUrl;

  const mockUser: UserAdmin = {
    id: 1,
    name: 'Ana',
    surname: 'García',
    username: 'anagarcia',
    email: 'ana@example.com',
    phone: '+34600000001',
    roleName: 'USER',
    roleId: 2,
    profileImageUrl: null,
    createdAt: '2024-01-01T10:00:00',
    updatedAt: null,
    lastLogin: null,
    isActive: true,
    isVerified: true,
    isBanned: false,
    locked: false,
    isDeleted: false,
    sessionCount: 3,
  };

  const mockPage: Page<UserAdmin> = {
    content: [mockUser],
    totalElements: 1,
    totalPages: 1,
    number: 0,
    size: 20,
  };

  const mockBanResponse: BannedUserResponse = {
    userId: 1,
    banned: true,
    bannedAt: '2024-06-01T12:00:00',
    bannedReason: null,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service  = TestBed.inject(AdminUsersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ── Listado ───────────────────────────────────────────────────────────────

  it('getUsersForAdmin() should GET /users with page params', () => {
    service.getUsersForAdmin({ page: 0, size: 20 }).subscribe(page => {
      expect(page).toEqual(mockPage);
    });
    const req = httpMock.expectOne(r =>
      r.url === api &&
      r.params.get('page') === '0' &&
      r.params.get('size') === '20'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockPage);
  });

  it('getUsersForAdmin() should handle page 2', () => {
    service.getUsersForAdmin({ page: 2, size: 10 }).subscribe();
    const req = httpMock.expectOne(r =>
      r.url === api &&
      r.params.get('page') === '2' &&
      r.params.get('size') === '10'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockPage);
  });

  // ── Detalle ───────────────────────────────────────────────────────────────

  it('getUserById() should GET /users/:id', () => {
    service.getUserById(1).subscribe(user => {
      expect(user).toEqual(mockUser);
    });
    const req = httpMock.expectOne(`${api}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  // ── Ban / unban ───────────────────────────────────────────────────────────

  it('banUser() should PUT /users/:id/ban', () => {
    service.banUser(1).subscribe(result => {
      expect(result).toEqual(mockBanResponse);
    });
    const req = httpMock.expectOne(`${api}/1/ban`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockBanResponse);
  });

  it('unbanUser() should PUT /users/:id/unban', () => {
    const unbanResponse: BannedUserResponse = { ...mockBanResponse, banned: false, bannedAt: null };
    service.unbanUser(1).subscribe(result => {
      expect(result).toEqual(unbanResponse);
    });
    const req = httpMock.expectOne(`${api}/1/unban`);
    expect(req.request.method).toBe('PUT');
    req.flush(unbanResponse);
  });
});
