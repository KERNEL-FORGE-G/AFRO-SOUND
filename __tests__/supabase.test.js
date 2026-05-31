import {supabase} from '../src/supabaseClient';

describe('Supabase Connection', () => {
  it('should be able to initialize the client', () => {
    expect(supabase).toBeDefined();
  });

  it('should have authentication and database methods', () => {
    expect(supabase.auth).toBeDefined();
    expect(supabase.from).toBeDefined();
  });
});
