import { describe, it, expect, vi } from 'vitest';
import { fetchMovies } from './api';

// Mock global fetch
global.fetch = vi.fn();

describe('api service', () => {
  it('fetchMovies should return results on success', async () => {
    const mockMovies = [{ id: 1, title: 'Test Movie' }];
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ results: mockMovies }),
    });

    const results = await fetchMovies();
    expect(results).toEqual(mockMovies);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/movie/popular'));
  });

  it('fetchMovies should throw error on failure', async () => {
    (fetch as any).mockResolvedValue({
      ok: false,
      status: 404,
    });

    await expect(fetchMovies()).rejects.toThrow('Failed to fetch movies: 404');
  });
});
