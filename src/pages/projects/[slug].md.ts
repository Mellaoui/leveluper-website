import type { APIRoute, GetStaticPaths } from 'astro';
import { getProjects, type Project } from '../../data/projects';
import { projectMarkdown } from '../../data/agent';

export const getStaticPaths = (async () => {
  const projects = await getProjects();
  return projects.map((project) => ({ params: { slug: project.id }, props: { project } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props, site }) =>
  new Response(projectMarkdown((props as { project: Project }).project, site!), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
