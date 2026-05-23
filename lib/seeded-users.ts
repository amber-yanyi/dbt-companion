// The five UUIDs seeded by supabase/seed-demo.sql. User-created demo
// accounts get fresh UUIDs and are not in this set. Used to gate
// destructive affordances like delete and to render persona hints only
// for the curated demo personas.
export const SEEDED_USER_IDS = new Set([
  "00000000-0000-0000-0000-000000000001", // Dr. Park
  "00000000-0000-0000-0000-000000000002", // Maya
  "00000000-0000-0000-0000-000000000003", // Luke
  "00000000-0000-0000-0000-000000000004", // Sarah
  "00000000-0000-0000-0000-000000000005", // Jordan
]);

export function isSeeded(userId: string): boolean {
  return SEEDED_USER_IDS.has(userId);
}

const SEEDED_ORDER = [
  "00000000-0000-0000-0000-000000000005", // Jordan
  "00000000-0000-0000-0000-000000000003", // Luke
  "00000000-0000-0000-0000-000000000002", // Maya
  "00000000-0000-0000-0000-000000000004", // Sarah
];

export function seededOrderRank(userId: string): number {
  const idx = SEEDED_ORDER.indexOf(userId);
  return idx === -1 ? 99 : idx;
}
