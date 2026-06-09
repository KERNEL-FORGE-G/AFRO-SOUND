import AuthService from '../src/services/authService';

describe('AuthService', () => {
  it('should have an emailPasswordLogin method', () => {
    expect(typeof AuthService.emailPasswordLogin).toBe('function');
  });
});
