// Window manager for the desktop home: open/close/focus windows,
// start menu, taskbar and clock. Content is server-rendered; this only toggles state.

export function initDesktop() {
  const wins = new Map<string, HTMLElement>();
  document.querySelectorAll<HTMLElement>('[data-win]').forEach((el) => wins.set(el.dataset.win!, el));

  let top = Math.max(0, ...[...wins.values()].map((el) => Number(el.dataset.z) || 0));
  const startBtn = document.getElementById('start-btn')!;
  const startMenu = document.getElementById('start-menu')!;
  const clock = document.getElementById('clock')!;

  const zOf = (el: HTMLElement) => Number(el.dataset.z) || 0;

  function refreshFront() {
    const open = [...wins.values()].filter((el) => !el.hidden);
    const front = open.sort((a, b) => zOf(b) - zOf(a))[0]?.dataset.win;
    wins.forEach((el, id) => {
      el.classList.toggle('is-front', id === front);
      const task = document.querySelector<HTMLElement>(`[data-task="${id}"]`);
      if (task) {
        task.hidden = el.hidden;
        task.classList.toggle('is-front', id === front);
      }
    });
  }

  function setStart(open: boolean) {
    startMenu.hidden = !open;
    startBtn.setAttribute('aria-expanded', String(open));
  }

  function openWin(id: string) {
    const el = wins.get(id);
    if (!el) return;
    top += 1;
    el.dataset.z = String(top);
    el.style.zIndex = String(10 + top);
    el.hidden = false;
    setStart(false);
    refreshFront();
  }

  function closeWin(id: string) {
    const el = wins.get(id);
    if (!el) return;
    el.hidden = true;
    refreshFront();
  }

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const opener = target.closest<HTMLElement>('[data-open]');
    const closer = target.closest<HTMLElement>('[data-close]');
    if (closer) return closeWin(closer.dataset.close!);
    if (opener) {
      openWin(opener.dataset.open!);
      wins.get(opener.dataset.open!)?.querySelector<HTMLElement>('.winbtn')?.focus({ preventScroll: true });
      return;
    }
    if (target.closest('#start-btn')) return setStart(startMenu.hidden);
    if (!target.closest('#start-menu')) setStart(false);
  });

  // Bring a window to the front when interacted with.
  wins.forEach((el, id) => {
    el.addEventListener('mousedown', () => {
      if (zOf(el) !== top) openWin(id);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !startMenu.hidden) {
      setStart(false);
      startBtn.focus();
    }
  });

  // Contact form: POST to the form service; fall back to the visitor's mail client if it fails.
  document.querySelector<HTMLFormElement>('[data-contact-form]')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    const status = form.querySelector<HTMLElement>('.status')!;
    const data = new FormData(form);
    if (data.get('_honey')) return; // bot
    const { endpoint, key } = form.dataset;
    const formspree = endpoint?.includes('formspree.io');

    const name = String(data.get('name'));
    const email = String(data.get('email'));
    const message = String(data.get('message'));
    const show = (text: string, ok: boolean) => {
      status.textContent = text;
      status.className = `status ${ok ? 'is-ok' : 'is-error'}`;
      status.hidden = false;
    };

    button.disabled = true;
    button.textContent = 'Sending…';
    try {
      if (!endpoint || (!key && !formspree)) throw new Error('Contact form not configured');
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...(key && { access_key: key, from_name: 'leveluper.com' }),
          name,
          email,
          message,
          subject: `leveluper.com: note from ${name}`,
          _subject: `leveluper.com: note from ${name}`,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === false || json.ok === false) throw new Error(json.message || `HTTP ${res.status}`);
      form.reset();
      show('Thanks, your message was sent. I’ll reply by email.', true);
    } catch {
      const subject = `Note from ${name}`;
      const body = `${message}\n\n— ${name} <${email}>`;
      show(`Opening your mail app to send this. You can also email ${form.dataset.email} directly.`, false);
      window.location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } finally {
      button.disabled = false;
      button.textContent = 'Send';
    }
  });

  function tick() {
    clock.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  tick();
  setInterval(tick, 30_000);

  refreshFront();
}
