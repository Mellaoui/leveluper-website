import type { APIRoute } from 'astro';
import { getProjects } from '../data/projects';
import { getJourney } from '../data/journey';
import { llmsTxt } from '../data/agent';

export const GET: APIRoute = async ({ site }) =>
  new Response(llmsTxt(await getProjects(), await getJourney(), site!), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
