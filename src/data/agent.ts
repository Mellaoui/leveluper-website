// Machine-readable views of the site for AI agents and crawlers:
// Markdown (llms.txt, per-project .md), JSON and schema.org JSON-LD.
import { about, now, site, socials } from './site';
import { isoDate, projectMdPath, projectPath, statusLabels, type Project } from './projects';
import { roleDates, roleDuration, roleLocation, type Role } from './journey';

const abs = (base: URL, path: string) => new URL(path, base).href;
const realSocials = () => socials.filter((s) => s.href.startsWith('http'));

export function aboutMarkdown() {
  return [`${about.role} — ${about.focus.join(', ')}.`, ...about.paragraphs].join('\n\n');
}

const currentlyMarkdown = () => now.items.map((i) => `- ${i.heading}: ${i.body}`).join('\n');

// One line per role, for llms.txt.
const roleLine = (r: Role) =>
  `- ${r.data.title}, ${r.data.company} (${r.data.type}, ${roleDates(r)}, ${roleLocation(r)}): ${r.data.summary}`;

function roleMarkdown(r: Role) {
  return [
    `### ${r.data.title} — ${r.data.company}`,
    `${r.data.type} · ${roleDates(r)} (${roleDuration(r)}) · ${roleLocation(r)}`,
    r.data.summary,
    r.data.tags.length ? `Skills: ${r.data.tags.join(', ')}` : '',
    (r.body ?? '').trim(),
  ]
    .filter(Boolean)
    .join('\n\n');
}

export function projectMeta(p: Project) {
  const d = p.data;
  return [
    `- Status: ${statusLabels[d.status]}`,
    d.category && `- Category: ${d.category}`,
    d.url && `- Website: ${d.url}`,
    d.repo && `- Source: ${d.repo}`,
    d.stack.length && `- Stack: ${d.stack.join(', ')}`,
    d.started && `- Started: ${isoDate(d.started)}`,
    `- Updated: ${isoDate(d.updated)}`,
  ]
    .filter(Boolean)
    .join('\n');
}

export function projectMarkdown(p: Project, base: URL) {
  return [
    `# ${p.data.name}`,
    `> ${p.data.summary}`,
    `${projectMeta(p)}\n- Page: ${abs(base, projectPath(p))}`,
    (p.body ?? '').trim(),
  ]
    .filter(Boolean)
    .join('\n\n') + '\n';
}

export function llmsTxt(projects: Project[], roles: Role[], base: URL) {
  return [
    `# ${site.brand}`,
    `> ${site.description}`,
    `${site.name} (${site.tagline}). Focus: ${about.focus.join(', ')}.`,
    ...about.paragraphs,
    `## Projects`,
    projects
      .map((p) => `- [${p.data.name}](${abs(base, projectMdPath(p))}): ${p.data.summary} Status: ${statusLabels[p.data.status]}.`)
      .join('\n'),
    `## Currently (updated ${now.updated})`,
    currentlyMarkdown(),
    `## Journey`,
    roles.map(roleLine).join('\n'),
    `## Contact`,
    [`- Email: ${site.email}`, ...realSocials().map((s) => `- ${s.label}: ${s.href}`)].join('\n'),
    `## Optional`,
    [
      `- [Full content in one file](${abs(base, '/llms-full.txt')}): about, journey and every project page`,
      `- [Projects as JSON](${abs(base, '/projects.json')}): structured list of all projects`,
      `- [Sitemap](${abs(base, '/sitemap.xml')})`,
    ].join('\n'),
  ].join('\n\n') + '\n';
}

export function llmsFullTxt(projects: Project[], roles: Role[], base: URL) {
  return [
    `# ${site.brand} — ${site.name}`,
    `> ${site.description}`,
    `## About\n\n${aboutMarkdown()}`,
    `## Currently (updated ${now.updated})\n\n${currentlyMarkdown()}`,
    `## Journey`,
    ...roles.map(roleMarkdown),
    `## Projects`,
    ...projects.map((p) => projectMarkdown(p, base).replace(/^# /, '### ').replace(/\n## /g, '\n#### ')),
  ].join('\n\n');
}

export function projectsJson(projects: Project[], base: URL) {
  return {
    owner: { name: site.name, brand: site.brand, url: base.href, email: site.email },
    updated: isoDate(new Date(Math.max(...projects.map((p) => p.data.updated.getTime())))),
    projects: projects.map((p) => ({
      id: p.id,
      name: p.data.name,
      summary: p.data.summary,
      status: p.data.status,
      statusLabel: statusLabels[p.data.status],
      category: p.data.category ?? null,
      url: p.data.url ?? null,
      repo: p.data.repo ?? null,
      stack: p.data.stack,
      tags: p.data.tags,
      started: p.data.started ? isoDate(p.data.started) : null,
      updated: isoDate(p.data.updated),
      page: abs(base, projectPath(p)),
      markdown: abs(base, projectMdPath(p)),
    })),
  };
}

// ---- schema.org JSON-LD ----

// Pass roles to list current employers alongside Leveluper.
export function personLd(base: URL, roles: Role[] = []) {
  const employers = roles
    .filter((r) => !r.data.end && r.data.type !== 'Freelance')
    .map((r) => ({ '@type': 'Organization', name: r.data.company, ...(r.data.companyUrl && { url: r.data.companyUrl }) }));
  return {
    '@type': 'Person',
    '@id': abs(base, '/#person'),
    name: site.name,
    jobTitle: about.role,
    knowsAbout: about.focus,
    homeLocation: { '@type': 'Place', name: 'Algiers' },
    url: base.href,
    sameAs: realSocials().map((s) => s.href),
    worksFor: [{ '@id': abs(base, '/#org') }, ...employers],
  };
}

export function orgLd(base: URL) {
  return {
    '@type': 'Organization',
    '@id': abs(base, '/#org'),
    name: site.brand,
    url: base.href,
    founder: { '@id': abs(base, '/#person') },
  };
}

export function projectLd(p: Project, base: URL) {
  return {
    '@type': 'SoftwareApplication',
    '@id': abs(base, `${projectPath(p)}#app`),
    name: p.data.name,
    description: p.data.summary,
    url: p.data.url ?? abs(base, projectPath(p)),
    applicationCategory: p.data.category,
    keywords: p.data.tags.join(', ') || undefined,
    dateModified: isoDate(p.data.updated),
    creator: { '@id': abs(base, '/#person') },
    publisher: { '@id': abs(base, '/#org') },
  };
}

export function projectListLd(projects: Project[], base: URL) {
  return {
    '@type': 'ItemList',
    name: `${site.brand} projects`,
    itemListElement: projects.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: abs(base, projectPath(p)),
      name: p.data.name,
    })),
  };
}
