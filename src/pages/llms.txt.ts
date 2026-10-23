import type { APIRoute } from 'astro';
import { getProjects } from '../data/projects';
import { llmsTxt } from '../data/agent';

export const GET: APIRoute = async ({ site }) =>
  new Response(llmsTxt(await getProjects(), site!), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
