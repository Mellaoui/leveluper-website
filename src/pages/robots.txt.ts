import type { APIRoute } from 'astro';

// Everything is public and meant to be read, by search engines and AI agents alike.
export const GET: APIRoute = ({ site }) =>
  new Response(
    [
      'User-agent: *',
      'Allow: /',
      '',
      '# AI agents: start at /llms.txt (summary) or /llms-full.txt (everything).',
      `Sitemap: ${new URL('/sitemap.xml', site)}`,
      '',
    ].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
