// All site content lives here.

export const site = {
  name: 'Mohamed Elghazali Mellaoui',
  brand: 'Leveluper',
  domain: 'leveluper.com',
  tagline: 'Backend & System Architecture Engineer · Algiers',
  // Used for <meta description>, llms.txt and search/AI summaries.
  description: 'Mohamed Elghazali Mellaoui is a backend and system architecture engineer in Algiers who designs and builds SaaS platforms, enterprise integrations and distributed systems. Leveluper is the home of those projects.',
  email: 'e.mellaoui@gmail.com',
  // Contact form delivery. Until a key is set, the form opens the visitor's mail app.
  // Web3Forms: get a free access key at https://web3forms.com (sent to your email) and paste it here.
  // (Formspree also works: set endpoint to https://formspree.io/f/<id> and leave accessKey empty.)
  contactForm: {
    endpoint: 'https://api.web3forms.com/submit',
    accessKey: '', // e.g. 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
  },
  // Theme options from the mockup:
  // wallpaper: #10243A | #1E2A24 | #2A1F2D | #22252B
  // accent:    #F2A33A | #7FD1B9 | #9DB7FF | #F28C8C
  wallpaper: '#10243A',
  accent: '#F2A33A',
};

export const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mohamedelghazali' },
  { label: 'X', href: 'https://x.com/weimin_devOps' },
  { label: 'GitHub', href: 'https://github.com/Mellaoui' },
];

export const about = {
  role: 'Backend & System Architecture Engineer',
  focus: ['SaaS', 'Enterprise Integrations', 'Distributed Systems', 'AI-Assisted Software Development'],
  paragraphs: [
    'I design and build reliable backend systems, SaaS platforms, and integrations between complex business applications. My work focuses on system architecture, API design, data modeling, authentication, multi-tenancy, asynchronous processing, observability, and long-term maintainability.',
    'I use AI-assisted engineering to work efficiently across programming languages and technology stacks, selecting tools based on system requirements rather than being limited to one framework or language.',
  ],
};

export type WindowId = 'about' | 'projects' | 'writing' | 'now' | 'contact';

export interface WindowDef {
  id: WindowId;
  title: string; // shown in the window title bar
  label: string; // shown on the taskbar
  menuLabel: string; // shown in the start menu
  icon: 'user' | 'folder' | 'doc' | 'pulse' | 'mail';
  iconLabel: string; // shown under the desktop icon
  x: number;
  y: number;
  width: number;
  open: boolean; // open on first load
  z: number; // initial stacking order (higher = in front)
}

export const windows: WindowDef[] = [
  { id: 'about', title: '~/about.md', label: 'about.md', menuLabel: 'About', icon: 'user', iconLabel: 'about.md', x: 180, y: 48, width: 580, open: true, z: 3 },
  { id: 'projects', title: '~/projects', label: 'projects', menuLabel: 'Projects', icon: 'folder', iconLabel: 'Projects', x: 300, y: 110, width: 620, open: false, z: 1 },
  { id: 'writing', title: '~/writing', label: 'writing', menuLabel: 'Writing', icon: 'doc', iconLabel: 'Writing', x: 420, y: 80, width: 560, open: false, z: 1 },
  { id: 'now', title: '~/now.md', label: 'now.md', menuLabel: 'Now', icon: 'pulse', iconLabel: 'now.md', x: 820, y: 140, width: 400, open: true, z: 2 },
  { id: 'contact', title: '~/contact', label: 'contact', menuLabel: 'Contact', icon: 'mail', iconLabel: 'Contact', x: 560, y: 170, width: 440, open: false, z: 1 },
];

// Projects live in src/content/projects/*.md (one file per project).

export interface Post {
  title: string;
  date: string;
  tag: string;
  href: string;
}

// Add posts here; the Writing window shows "No posts yet" while this is empty.
export const posts: Post[] = [];

export const now = {
  updated: 'October 2026',
  items: [
    { heading: 'Focus', body: 'Running Verifeye and TravelTo in production.' },
    { heading: 'Building', body: 'leveluper.com' },
  ],
};
