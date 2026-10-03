(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  // Basics
  $('#year').textContent = new Date().getFullYear();

  const header = $('#siteHeader');
  const progress = $('#scrollProgress');
  const updateScrollUI = () => {
    const y = window.scrollY;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    progress.style.transform = `scaleX(${Math.min(1, y / max)})`;
    header.classList.toggle('scrolled', y > 24);

    if (!reducedMotion) {
      $$('[data-parallax]').forEach(el => {
        const speed = Number(el.dataset.parallax || 0);
        el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
      });
    }
  };
  window.addEventListener('scroll', updateScrollUI, { passive: true });
  updateScrollUI();

  // Mobile navigation
  const menuToggle = $('#menuToggle');
  const navLinks = $('#navLinks');
  const closeMenu = () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
    navLinks.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    menuToggle.setAttribute('aria-label', open ? 'Open navigation menu' : 'Close navigation menu');
    navLinks.classList.toggle('is-open', !open);
    document.body.classList.toggle('menu-open', !open);
  });
  $$('.nav-links a').forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  // Section reveal choreography
  $$('.reveal').forEach(el => {
    el.style.setProperty('--delay', `${Number(el.dataset.delay || 0)}ms`);
  });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.13, rootMargin: '0px 0px -5% 0px' });
  $$('.reveal').forEach(el => revealObserver.observe(el));

  // Skill meter activation
  const skillsBoard = $('.skills-board');
  const skillObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      window.setTimeout(() => skillsBoard.classList.add('is-animated'), reducedMotion ? 0 : 220);
      skillObserver.disconnect();
    }
  }, { threshold: 0.32 });
  skillObserver.observe(skillsBoard);

  // Count up statistics
  const counters = $$('.counter');
  const animateCounter = el => {
    const target = Number(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    if (reducedMotion) {
      el.textContent = target.toLocaleString('en-US') + suffix;
      return;
    }
    const duration = target >= 500 ? 1750 : 1300;
    const start = performance.now();
    const tick = now => {
      const elapsed = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - elapsed, 4);
      el.textContent = Math.round(target * eased).toLocaleString('en-US') + suffix;
      if (elapsed < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    });
  }, { threshold: 0.55 });
  counters.forEach(counter => counterObserver.observe(counter));

  // Interactive career timeline accordion
  const timeline = $('.timeline');
  const timelineItems = $$('.timeline-item', timeline);
  const updateTimelineRail = index => {
    const progressValue = timelineItems.length < 2 ? 100 : 7 + (index / (timelineItems.length - 1)) * 86;
    timeline.style.setProperty('--rail-progress', `${progressValue}%`);
  };
  timelineItems.forEach((item, index) => {
    const trigger = $('.timeline-trigger', item);
    trigger.addEventListener('click', () => {
      const wasOpen = item.classList.contains('is-open');
      timelineItems.forEach(other => {
        other.classList.remove('is-open');
        $('.timeline-trigger', other).setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        updateTimelineRail(index);
      }
    });
  });
  updateTimelineRail(0);

  // Current section in navigation
  const navAnchors = $$('.nav-links a[href^="#"]');
  const navById = new Map(navAnchors.map(a => [a.getAttribute('href').slice(1), a]));
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navAnchors.forEach(a => a.classList.remove('active'));
      navById.get(entry.target.id)?.classList.add('active');
    });
  }, { rootMargin: '-38% 0px -54% 0px', threshold: 0 });
  $$('main section[id]').forEach(section => sectionObserver.observe(section));

  // Soft magnetic movement on fine pointers
  if (window.matchMedia('(pointer: fine)').matches && !reducedMotion) {
    $$('.magnetic').forEach(el => {
      el.addEventListener('pointermove', event => {
        const rect = el.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * 0.08;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.12;
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });

    $$('.tilt-card').forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateX(${-py * 3.5}deg) rotateY(${px * 4.5}deg) translateY(-2px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  // Real-time water droplet field
  class WaterField {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d', { alpha: true });
      this.dpr = 1;
      this.width = 0;
      this.height = 0;
      this.drops = [];
      this.ripples = [];
      this.last = performance.now();
      this.running = !document.hidden;
      this.reduced = reducedMotion;
      this.pointerThrottle = 0;

      this.resize = this.resize.bind(this);
      this.frame = this.frame.bind(this);
      window.addEventListener('resize', this.resize, { passive: true });
      document.addEventListener('visibilitychange', () => {
        this.running = !document.hidden;
        this.last = performance.now();
        if (this.running) requestAnimationFrame(this.frame);
      });
      window.addEventListener('pointerdown', e => this.addRipple(e.clientX, e.clientY, true), { passive: true });
      window.addEventListener('pointermove', e => {
        const now = performance.now();
        if (now - this.pointerThrottle > 190 && e.pointerType !== 'touch') {
          this.pointerThrottle = now;
          if (Math.random() > 0.55) this.addRipple(e.clientX, e.clientY, false);
        }
      }, { passive: true });
      this.resize();
      if (this.reduced) this.drawStill();
      else requestAnimationFrame(this.frame);
    }

    resize() {
      this.dpr = Math.min(2, window.devicePixelRatio || 1);
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = Math.round(this.width * this.dpr);
      this.canvas.height = Math.round(this.height * this.dpr);
      this.canvas.style.width = `${this.width}px`;
      this.canvas.style.height = `${this.height}px`;
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      const density = this.width < 600 ? 13 : this.width < 1000 ? 21 : 31;
      this.drops = Array.from({ length: density }, () => this.makeDrop(true));
      this.ripples = [];
      if (this.reduced) this.drawStill();
    }

    makeDrop(initial = false) {
      const depth = Math.random();
      return {
        x: Math.random() * this.width,
        y: initial ? Math.random() * this.height : -40 - Math.random() * 260,
        radius: 1.1 + depth * 2.25,
        length: 7 + depth * 17,
        speed: 72 + depth * 92,
        drift: (Math.random() - 0.5) * 7,
        alpha: 0.14 + depth * 0.32,
        phase: Math.random() * Math.PI * 2,
        depth
      };
    }

    addRipple(x, y, strong = false) {
      if (this.ripples.length > 26) this.ripples.shift();
      this.ripples.push({ x, y, age: 0, life: strong ? 1250 : 850, size: strong ? 68 : 34, alpha: strong ? .42 : .18 });
    }

    resetDrop(drop) {
      if (Math.random() > .45) this.addRipple(drop.x, this.height - 5 - Math.random() * 15, false);
      Object.assign(drop, this.makeDrop(false));
    }

    drawDrop(drop) {
      const ctx = this.ctx;
      const sway = Math.sin(drop.phase) * (1.3 + drop.depth * 2.2);
      const x = drop.x + sway;
      const y = drop.y;
      ctx.save();
      ctx.globalAlpha = drop.alpha;
      ctx.globalCompositeOperation = 'screen';

      // Faint acceleration streak
      const trail = ctx.createLinearGradient(x, y - drop.length * 3, x, y + 2);
      trail.addColorStop(0, 'rgba(90, 219, 211, 0)');
      trail.addColorStop(.65, 'rgba(90, 219, 211, .08)');
      trail.addColorStop(1, 'rgba(210, 255, 250, .55)');
      ctx.strokeStyle = trail;
      ctx.lineWidth = Math.max(.45, drop.radius * .45);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x - drop.drift * .06, y - drop.length * 2.7);
      ctx.quadraticCurveTo(x + sway * .2, y - drop.length, x, y);
      ctx.stroke();

      // Refractive droplet body
      const grad = ctx.createRadialGradient(x - drop.radius * .4, y - drop.radius * .7, .1, x, y, drop.radius * 1.8);
      grad.addColorStop(0, 'rgba(245,255,255,.98)');
      grad.addColorStop(.22, 'rgba(147,237,230,.72)');
      grad.addColorStop(.63, 'rgba(28,155,149,.28)');
      grad.addColorStop(1, 'rgba(9,75,72,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(x, y - drop.radius * 2.2);
      ctx.bezierCurveTo(x + drop.radius * .9, y - drop.radius * .2, x + drop.radius * 1.2, y + drop.radius * .65, x, y + drop.radius * 1.2);
      ctx.bezierCurveTo(x - drop.radius * 1.2, y + drop.radius * .65, x - drop.radius * .9, y - drop.radius * .2, x, y - drop.radius * 2.2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255,255,255,.75)';
      ctx.beginPath();
      ctx.arc(x - drop.radius * .28, y - drop.radius * .72, Math.max(.25, drop.radius * .19), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    drawRipple(ripple) {
      const ctx = this.ctx;
      const t = ripple.age / ripple.life;
      const eased = 1 - Math.pow(1 - t, 2);
      const w = 5 + ripple.size * eased;
      const alpha = ripple.alpha * (1 - t);
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (let i = 0; i < 2; i++) {
        ctx.beginPath();
        ctx.ellipse(ripple.x, ripple.y, w * (1 + i * .27), w * .26 * (1 + i * .12), 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(98,217,208,${alpha * (1 - i * .42)})`;
        ctx.lineWidth = .75;
        ctx.stroke();
      }
      ctx.restore();
    }

    drawStill() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);
      this.drops.slice(0, 10).forEach(drop => this.drawDrop(drop));
    }

    frame(now) {
      if (!this.running || this.reduced) return;
      const dt = Math.min(34, now - this.last) / 1000;
      this.last = now;
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);

      this.drops.forEach(drop => {
        drop.y += drop.speed * dt;
        drop.x += drop.drift * dt;
        drop.phase += dt * (1.1 + drop.depth);
        if (drop.y > this.height + 32 || drop.x < -20 || drop.x > this.width + 20) this.resetDrop(drop);
        this.drawDrop(drop);
      });

      this.ripples = this.ripples.filter(ripple => {
        ripple.age += dt * 1000;
        if (ripple.age >= ripple.life) return false;
        this.drawRipple(ripple);
        return true;
      });
      requestAnimationFrame(this.frame);
    }
  }

  new WaterField($('#waterCanvas'));
})();
