import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const schema = readFileSync(resolve(process.cwd(), 'supabase/schema.sql'), 'utf8');

describe('Supabase schema contract', () => {
  it('keeps the vector search dimensions aligned with the browser model', () => {
    expect(schema).toMatch(/embedding vector\(384\)/);
    expect(schema).toContain('query_embedding vector(384)');
    expect(schema).toContain('public.match_items');
  });

  it('protects every user-owned table with RLS policies', () => {
    for (const table of ['profiles', 'rooms', 'boxes', 'items']) {
      expect(schema).toContain(`alter table public.${table} enable row level security`);
      expect(schema).toContain(`create policy`);
      expect(schema).toContain(`on public.${table}`);
    }
  });
});
