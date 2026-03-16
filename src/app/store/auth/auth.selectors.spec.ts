import { selectIsTokenValid } from './auth.selectors';

// Genera un JWT con el exp dado (en segundos desde epoch)
function makeToken(expSeconds: number): string {
  const payload = btoa(JSON.stringify({ exp: expSeconds }));
  return `header.${payload}.signature`;
}

describe('selectIsTokenValid', () => {
  const project = (token: string | null) =>
    selectIsTokenValid.projector(token);

  it('should return false when token is null', () => {
    expect(project(null)).toBeFalse();
  });

  it('should return false when token is malformed', () => {
    expect(project('not.a.jwt')).toBeFalse();
  });

  it('should return false when token is expired', () => {
    const pastExp = Math.floor(Date.now() / 1000) - 3600;
    expect(project(makeToken(pastExp))).toBeFalse();
  });

  it('should return true when token is valid', () => {
    const futureExp = Math.floor(Date.now() / 1000) + 3600;
    expect(project(makeToken(futureExp))).toBeTrue();
  });
});
