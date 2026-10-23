import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

export const statusLabels: Record<Project['data']['status'], string> = {
  idea: 'Idea',
  validating: 'In validation',
  building: 'Building',
  'coming-soon': 'Coming soon',
  live: 'Live',
  paused: 'Paused',
  archived: 'Archived',
};

export async function getProjects(): Promise<Project[]> {
  const all = await getCollection('projects');
  return all.sort((a, b) => a.data.order - b.data.order || a.data.name.localeCompare(b.data.name));
}

export const projectPath = (p: Project) => `/projects/${p.id}/`;
export const projectMdPath = (p: Project) => `/projects/${p.id}.md`;

export const isoDate = (d: Date) => d.toISOString().slice(0, 10);
