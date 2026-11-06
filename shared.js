(() => {
  const icons = {
    menu: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    user: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    heart: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>',
    arrow: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>',
    search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    filter: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M7 12h10M10 18h4"/></svg>',
    share: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/></svg>'
  };

  window.DWD = {
    icons,
    money(value) {
      return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(value).replace('PHP', '₱');
    },
    vehicleCard(car) {
      return `
        <article class="vehicle-card reveal" data-id="${car.id}" data-brand="${car.brand}" data-body="${car.body}" data-fuel="${car.fuel}" data-price="${car.price}">
          <div class="vehicle-image-wrap">
            <img src="${car.image}" alt="${car.year} ${car.brand} ${car.model}" loading="lazy">
            <span class="vehicle-badge">${car.badge}</span>
            <button class="favorite-button" type="button" aria-label="Save ${car.brand} ${car.model}" data-favorite="${car.id}">${icons.heart}</button>
          </div>
          <div class="vehicle-content">
            <span class="vehicle-brand">${car.brand}</span>
            <div class="vehicle-title-row">
              <h3>${car.year} ${car.model}</h3>
              <strong>${this.money(car.price)}</strong>
            </div>
            <div class="vehicle-specs">
              <div class="vehicle-spec"><strong>${car.transmission}</strong><span>Transmission</span></div>
              <div class="vehicle-spec"><strong>${car.fuel}</strong><span>Fuel type</span></div>
              <div class="vehicle-spec"><strong>${car.mileage}</strong><span>Mileage</span></div>
            </div>
            <div class="vehicle-card-footer">
              <a href="info.html?id=${car.id}">View details ${icons.arrow}</a>
              <small>${car.body}</small>
            </div>
          </div>
        </article>`;
    },
    showToast(message) {
      let toast = document.querySelector('.toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = '<span class="toast-dot"></span><span></span>';
        document.body.appendChild(toast);
      }
      toast.lastElementChild.textContent = message;
      toast.classList.add('show');
      clearTimeout(window.__dwdToast);
      window.__dwdToast = setTimeout(() => toast.classList.remove('show'), 2800);
    },
    refreshReveal() {
      const items = document.querySelectorAll('.reveal:not(.visible)');
      if (!('IntersectionObserver' in window)) {
        items.forEach(item => item.classList.add('visible'));
        return;
      }
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: .12 });
      items.forEach(item => observer.observe(item));
    }
  };

  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-button');
  const navLinks = document.querySelector('.nav-links');
  const authModal = document.querySelector('.modal-backdrop');

  const setMenu = open => {
    navLinks?.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    if (menuButton) menuButton.innerHTML = open ? icons.close : icons.menu;
  };
  menuButton?.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
  navLinks?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));

  const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const openAuth = panel => {
    if (!authModal) return;
    authModal.classList.add('open');
    authModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    authModal.querySelectorAll('.auth-panel').forEach(item => item.classList.toggle('active', item.dataset.panel === panel));
  };
  const closeAuth = () => {
    authModal?.classList.remove('open');
    authModal?.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  };
  document.querySelectorAll('[data-open-auth]').forEach(btn => btn.addEventListener('click', () => openAuth(btn.dataset.openAuth || 'login')));
  document.querySelectorAll('[data-auth-switch]').forEach(btn => btn.addEventListener('click', () => openAuth(btn.dataset.authSwitch)));
  document.querySelectorAll('[data-close-auth]').forEach(btn => btn.addEventListener('click', closeAuth));
  authModal?.addEventListener('click', e => { if (e.target === authModal) closeAuth(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeAuth(); setMenu(false); } });

  document.querySelectorAll('.auth-form, .newsletter, [data-demo-form]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const msg = form.dataset.message || 'Thanks! This frontend demo is ready for backend integration.';
      window.DWD.showToast(msg);
      if (form.classList.contains('auth-form')) closeAuth();
      form.reset();
    });
  });

  document.addEventListener('click', e => {
    const favorite = e.target.closest('[data-favorite]');
    if (!favorite) return;
    favorite.classList.toggle('active');
    const active = favorite.classList.contains('active');
    window.DWD.showToast(active ? 'Vehicle saved to your favorites.' : 'Vehicle removed from favorites.');
  });

  window.DWD.refreshReveal();
})();
