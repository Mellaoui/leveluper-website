import { getCollection, type CollectionEntry } from 'astro:content';

export type Role = CollectionEntry<'journey'>;

// Newest first; current roles (no end date) before finished ones that started at the same time.
export async function getJourney(): Promise<Role[]> {
  const all = await getCollection('journey');
  return all.sort((a, b) => b.data.start.localeCompare(a.data.start) || (a.data.end ? 1 : 0) - (b.data.end ? 1 : 0));
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const toIndex = (ym: string) => Number(ym.slice(0, 4)) * 12 + Number(ym.slice(5, 7)) - 1;
const formatMonth = (ym: string) => `${monthNames[Number(ym.slice(5, 7)) - 1]} ${ym.slice(0, 4)}`;

const nowMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

// "Jan 2025 – Present"
export const roleDates = (r: Role) => `${formatMonth(r.data.start)} – ${r.data.end ? formatMonth(r.data.end) : 'Present'}`;

// LinkedIn-style duration, counting both the first and last month: "1 yr 10 mos"
export function roleDuration(r: Role) {
  const months = toIndex(r.data.end ?? nowMonth()) - toIndex(r.data.start) + 1;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y && `${y} yr${y > 1 ? 's' : ''}`, m && `${m} mo${m > 1 ? 's' : ''}`].filter(Boolean).join(' ');
}

export const roleLocation = (r: Role) => `${r.data.location}${r.data.remote ? ' (Remote)' : ''}`;
