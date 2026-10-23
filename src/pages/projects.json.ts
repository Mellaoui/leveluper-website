import type { APIRoute } from 'astro';
import { getProjects } from '../data/projects';
import { projectsJson } from '../data/agent';

export const GET: APIRoute = async ({ site }) =>
  new Response(JSON.stringify(projectsJson(await getProjects(), site!), null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
