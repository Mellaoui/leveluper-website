import type { APIRoute } from 'astro';
import { getProjects } from '../data/projects';
import { llmsFullTxt } from '../data/agent';

export const GET: APIRoute = async ({ site }) =>
  new Response(llmsFullTxt(await getProjects(), site!), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
