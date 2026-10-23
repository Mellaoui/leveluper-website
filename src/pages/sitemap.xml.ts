import type { APIRoute } from 'astro';
import { getProjects, isoDate, projectPath } from '../data/projects';

export const GET: APIRoute = async ({ site }) => {
  const projects = await getProjects();
  const latest = isoDate(new Date(Math.max(...projects.map((p) => p.data.updated.getTime()))));
  const urls = [
    { loc: '/', lastmod: latest },
    { loc: '/projects/', lastmod: latest },
    ...projects.map((p) => ({ loc: projectPath(p), lastmod: isoDate(p.data.updated) })),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${new URL(u.loc, site)}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
