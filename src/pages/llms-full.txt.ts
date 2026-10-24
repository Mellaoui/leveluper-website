import type { APIRoute } from 'astro';
import { getProjects } from '../data/projects';
import { getJourney } from '../data/journey';
import { llmsFullTxt } from '../data/agent';

export const GET: APIRoute = async ({ site }) =>
  new Response(llmsFullTxt(await getProjects(), await getJourney(), site!), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
