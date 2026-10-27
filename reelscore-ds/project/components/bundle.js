/* @ds-bundle: {"format":4,"namespace":"Reelscore","components":[{"name":"Icon"},{"name":"Button"},{"name":"IconButton"},{"name":"NavBar"},{"name":"BottomNav"},{"name":"Tabs"},{"name":"GenreChips"},{"name":"AgeBadge"},{"name":"RatingBadge"},{"name":"RatingInput"},{"name":"MovieCard"},{"name":"PosterRow"},{"name":"Hero"},{"name":"Footer"},{"name":"CastStrip"},{"name":"AccountMenuItem"},{"name":"AccountMenuDivider"},{"name":"AccountMenu"}]} */
(function () {
  var React = window.React;
  var h = React.createElement;

  function cx() {
    return Array.prototype.filter.call(arguments, Boolean).join(' ');
  }
  function omit(obj, keys) {
    var out = {};
    for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && keys.indexOf(k) < 0) out[k] = obj[k];
    return out;
  }

  /* 24x24 glyphs, drawn for this system, filled with currentColor (evenodd). */
  var PATHS = {
    star: 'M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z',
    heart: 'M12 20.5l-1.2-1.1C6 15.1 3 12.3 3 8.9 3 6.1 5.1 4 7.8 4c1.6 0 3.1.7 4.2 1.9C13.1 4.7 14.6 4 16.2 4 18.9 4 21 6.1 21 8.9c0 3.4-3 6.2-7.8 10.5z',
    eye: 'M12 5C6.5 5 2.7 9.2 1.5 12c1.2 2.8 5 7 10.5 7s9.3-4.2 10.5-7C21.3 9.2 17.5 5 12 5zm0 3a4 4 0 100 8 4 4 0 000-8zm0 2.2a1.8 1.8 0 110 3.6 1.8 1.8 0 010-3.6z',
    play: 'M7 4.5v15l12.5-7.5z',
    plus: 'M12 2a10 10 0 110 20 10 10 0 010-20zm0 2a8 8 0 100 16 8 8 0 000-16zm-1 3.5h2V11h3.5v2H13v3.5h-2V13H7.5v-2H11z',
    search: 'M10.5 3a7.5 7.5 0 015.96 12.05l4.25 4.24-1.42 1.42-4.24-4.25A7.5 7.5 0 1110.5 3zm0 2a5.5 5.5 0 100 11 5.5 5.5 0 000-11z',
    bell: 'M12 2.5A1.5 1.5 0 0113.5 4v.7A6 6 0 0118 10.5V15l2 2.5v1H4v-1L6 15v-4.5a6 6 0 014.5-5.8V4A1.5 1.5 0 0112 2.5zM9.5 19.5h5a2.5 2.5 0 01-5 0z',
    chevronLeft: 'M15.4 4.6L16.8 6l-6 6 6 6-1.4 1.4L8 12z',
    chevronRight: 'M8.6 4.6L7.2 6l6 6-6 6 1.4 1.4L16 12z',
    home: 'M12 3l9 7.5V21h-6v-6H9v6H3V10.5z',
    film: 'M4 3h16v18H4zm2 2v2h2V5zm10 0v2h2V5zM6 9v2h2V9zm10 0v2h2V9zM6 13v2h2v-2zm10 0v2h2v-2zM6 17v2h2v-2zm10 0v2h2v-2zM10 5v14h4V5z',
    tv: 'M3 5h18v12H3zm2 2v8h14V7zM8 19h8v2H8z',
    list: 'M4 6h16v2H4zm0 5h16v2H4zm0 5h10v2H4z',
    check: 'M9.5 16.2L5.3 12l-1.4 1.4 5.6 5.6L20.1 8.4 18.7 7z',
    user: 'M12 3a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm0 11c4.4 0 8 2.2 8 5v2H4v-2c0-2.8 3.6-5 8-5z',
    menu: 'M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z',
    close: 'M6.4 5L12 10.6 17.6 5 19 6.4 13.4 12 19 17.6 17.6 19 12 13.4 6.4 19 5 17.6 10.6 12 5 6.4z',
    settings: 'M9.67 4.13C9.72 3.55 9.99 3.01 10.42 2.62C10.85 2.23 11.41 2.01 12.00 2.01C12.58 2.01 13.14 2.23 13.57 2.62C14.00 3.01 14.27 3.55 14.32 4.13C14.36 4.51 14.48 4.87 14.68 5.18C14.88 5.50 15.16 5.76 15.49 5.95C15.81 6.14 16.18 6.25 16.55 6.26C16.93 6.28 17.30 6.21 17.64 6.05C18.17 5.81 18.77 5.77 19.33 5.95C19.88 6.13 20.35 6.50 20.64 7.01C20.93 7.51 21.02 8.10 20.90 8.67C20.78 9.24 20.45 9.74 19.97 10.08C19.67 10.30 19.41 10.58 19.24 10.92C19.07 11.25 18.98 11.62 18.98 12.00C18.98 12.37 19.07 12.74 19.24 13.07C19.41 13.41 19.67 13.70 19.97 13.91C20.45 14.25 20.78 14.75 20.90 15.32C21.02 15.89 20.93 16.48 20.64 16.98C20.35 17.49 19.88 17.86 19.33 18.04C18.77 18.22 18.17 18.18 17.64 17.94C17.30 17.79 16.93 17.71 16.55 17.73C16.18 17.74 15.81 17.85 15.49 18.04C15.16 18.23 14.88 18.49 14.68 18.81C14.48 19.12 14.36 19.48 14.32 19.86C14.27 20.44 14.00 20.98 13.57 21.37C13.14 21.76 12.58 21.98 12.00 21.98C11.41 21.98 10.85 21.76 10.42 21.37C9.99 20.98 9.72 20.44 9.67 19.86C9.63 19.48 9.51 19.12 9.31 18.81C9.11 18.49 8.83 18.23 8.50 18.04C8.18 17.85 7.81 17.74 7.44 17.73C7.06 17.71 6.69 17.79 6.35 17.94C5.82 18.18 5.22 18.22 4.66 18.04C4.11 17.86 3.64 17.49 3.35 16.98C3.06 16.48 2.97 15.89 3.09 15.32C3.21 14.75 3.54 14.25 4.02 13.91C4.32 13.70 4.57 13.41 4.75 13.07C4.92 12.74 5.01 12.37 5.01 12.00C5.01 11.62 4.92 11.25 4.75 10.92C4.57 10.58 4.32 10.30 4.02 10.08C3.54 9.74 3.21 9.24 3.09 8.67C2.97 8.10 3.06 7.51 3.35 7.01C3.64 6.51 4.11 6.13 4.66 5.95C5.22 5.77 5.82 5.81 6.34 6.05C6.69 6.21 7.06 6.28 7.43 6.26C7.81 6.25 8.18 6.14 8.50 5.95C8.83 5.76 9.10 5.50 9.31 5.18C9.51 4.87 9.63 4.51 9.66 4.13M14.99 12.00C14.99 13.65 13.65 15.00 11.99 15.00C10.34 15.00 8.99 13.65 8.99 12.00C8.99 10.34 10.34 9.00 11.99 9.00C13.65 9.00 14.99 10.34 14.99 12.00Z'
  };
  /* Glyphs drawn as a 2px outline rather than a fill (the settings gear). */
  var STROKED = { settings: true };

  function Icon(props) {
    var size = props.size || 20;
    var d = PATHS[props.name] || PATHS.star;
    var a11y = props.title ? { role: 'img', 'aria-label': props.title } : { 'aria-hidden': 'true', focusable: 'false' };
    var stroked = STROKED[props.name];
    return h('svg', Object.assign({
      className: cx('rs-icon', props.className),
      width: size, height: size, viewBox: '0 0 24 24', fill: stroked ? 'none' : 'currentColor'
    }, a11y), h('path', stroked
      ? { d: d, stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round' }
      : { d: d, fillRule: 'evenodd', clipRule: 'evenodd' }));
  }
  Icon.names = Object.keys(PATHS);

  function Button(props) {
    var variant = props.variant || 'primary';
    var size = props.size || 'md';
    var rest = omit(props, ['variant', 'size', 'icon', 'fullWidth', 'className', 'children', 'href']);
    var inner = [
      props.icon ? h(Icon, { key: 'i', name: props.icon, size: size === 'sm' ? 16 : 18 }) : null,
      h('span', { key: 'l' }, props.children)
    ];
    var cls = cx('rs-btn', 'rs-btn--' + variant, 'rs-btn--' + size, props.fullWidth && 'rs-btn--block', props.className);
    if (props.href) return h('a', Object.assign({ href: props.href, className: cls }, rest), inner);
    return h('button', Object.assign({ type: 'button', className: cls }, rest), inner);
  }

  function IconButton(props) {
    var variant = props.variant || 'ghost';
    var size = props.size || 'md';
    var rest = omit(props, ['icon', 'label', 'variant', 'size', 'pressed', 'className', 'badge']);
    var extra = {};
    if (props.pressed !== undefined) extra['aria-pressed'] = props.pressed ? 'true' : 'false';
    return h('button', Object.assign({
      type: 'button',
      className: cx('rs-iconbtn', 'rs-iconbtn--' + variant, 'rs-iconbtn--' + size, props.pressed && 'is-pressed', props.className),
      'aria-label': props.label,
      title: props.label
    }, extra, rest),
      h(Icon, { name: props.icon, size: size === 'sm' ? 16 : size === 'lg' ? 24 : 20 }),
      props.badge ? h('span', { className: 'rs-iconbtn__dot', 'aria-hidden': 'true' }) : null
    );
  }

  function Wordmark(props) {
    return h('a', { className: 'rs-wordmark', href: props.href || '/', 'aria-label': (props.brand || 'Reelscore') + ' home' }, props.brand || 'Reelscore');
  }

  /* Critically damped spring (SmoothDamp): eases toward a moving target and keeps its velocity when the target changes mid-flight. */
  function smoothDamp(cur, target, vel, smoothTime, dt) {
    var omega = 2 / smoothTime, x = omega * dt;
    var decay = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
    var change = cur - target;
    var temp = (vel + omega * change) * dt;
    return [target + (change + temp) * decay, (vel - omega * temp) * decay];
  }

  var SEARCH_SMOOTH_TIME = 0.16; // seconds to cover most of the distance
  var SEARCH_MAX = 360;
  var SEARCH_MIN = 220; // below this the field covers the links, then the wordmark, rather than shrink
  var SEARCH_GAP = 16;

  /* The NavBar's search: the icon grows leftwards into a field. It sizes itself to the space it finds and tells the bar what it covers. */
  function NavSearch(props) {
    var openSt = React.useState(!!props.defaultOpen);
    var open = openSt[0], setOpen = openSt[1];
    var valSt = React.useState(props.defaultValue || '');
    var value = props.value !== undefined ? props.value : valSt[0];
    var uid = React.useId ? React.useId() : 'rs-search';
    var inputId = uid + '-input', panelId = uid + '-panel';
    var wrapRef = React.useRef(null), formRef = React.useRef(null), inputRef = React.useRef(null), toggleRef = React.useRef(null), panelRef = React.useRef(null);
    var hasPanel = open && props.panel != null && props.panel !== false;
    var anim = React.useRef({ x: 0, v: 0, target: 0, full: 0, raf: 0, last: 0 });
    var first = React.useRef(true);
    var onCover = props.onCover;
    var valueRef = React.useRef(value);
    valueRef.current = value;

    function base() { return toggleRef.current ? toggleRef.current.offsetWidth : 40; }

    function paint() {
      var a = anim.current, f = formRef.current, b = base();
      if (!f) return;
      f.style.width = a.x + 'px';
      if (panelRef.current) panelRef.current.style.width = a.x + 'px';
      var p = a.full > b ? (a.x - b) / (a.full - b) : 0;
      f.style.setProperty('--rs-search-p', String(Math.max(0, Math.min(1, p))));
    }

    function run(instant) {
      var a = anim.current;
      var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (instant || reduced) { cancelAnimationFrame(a.raf); a.raf = 0; a.x = a.target; a.v = 0; paint(); return; }
      if (a.raf) return;
      a.last = performance.now();
      function tick(now) {
        var dt = Math.min(0.064, (now - a.last) / 1000);
        a.last = now;
        var r = smoothDamp(a.x, a.target, a.v, SEARCH_SMOOTH_TIME, dt);
        a.x = r[0]; a.v = r[1];
        if (Math.abs(a.x - a.target) < 0.5 && Math.abs(a.v) < 10) { a.x = a.target; a.v = 0; a.raf = 0; paint(); return; }
        paint();
        a.raf = requestAnimationFrame(tick);
      }
      a.raf = requestAnimationFrame(tick);
    }

    // Widest field that fits left of the icon: clear of the links, else over the links, else over the wordmark too.
    function measure() {
      var wrap = wrapRef.current, inner = wrap && wrap.closest('.rs-nav__inner');
      if (!inner) return { w: SEARCH_MAX, cover: null };
      var right = wrap.getBoundingClientRect().right;
      var box = inner.getBoundingClientRect();
      var start = box.left + (parseFloat(getComputedStyle(inner).paddingLeft) || 0);
      var links = inner.querySelector('.rs-nav__links');
      var list = links && getComputedStyle(links).display !== 'none' ? links.querySelector('ul') : null;
      var mark = inner.querySelector('.rs-wordmark');
      var edges = [];
      if (list) edges.push({ edge: list.getBoundingClientRect().right + SEARCH_GAP, cover: null });
      if (mark) edges.push({ edge: mark.getBoundingClientRect().right + SEARCH_GAP, cover: list ? 'links' : null });
      edges.push({ edge: start, cover: 'all' });
      for (var i = 0; i < edges.length; i++) {
        var room = right - edges[i].edge;
        if (room >= SEARCH_MIN || i === edges.length - 1) return { w: Math.max(base(), Math.min(SEARCH_MAX, room)), cover: edges[i].cover };
      }
    }

    function expand(instant) {
      var m = measure(), a = anim.current;
      if (onCover) onCover(m.cover);
      a.full = a.target = m.w;
      run(instant);
    }

    React.useLayoutEffect(function () {
      var a = anim.current, instant = first.current;
      first.current = false;
      if (instant && !open) { a.x = a.target = base(); paint(); return; }
      if (open) expand(instant);
      else { if (onCover) onCover(null); a.target = base(); run(false); }
    }, [open]);

    React.useEffect(function () {
      if (!open || typeof ResizeObserver === 'undefined') return;
      var inner = wrapRef.current && wrapRef.current.closest('.rs-nav__inner');
      if (!inner) return;
      var ro = new ResizeObserver(function () { expand(false); });
      ro.observe(inner);
      return function () { ro.disconnect(); };
    }, [open]);

    React.useEffect(function () { return function () { cancelAnimationFrame(anim.current.raf); }; }, []);

    function setValue(v) {
      if (props.value === undefined) valSt[1](v);
      if (props.onChange) props.onChange(v);
    }
    function show() {
      if (!open) { setOpen(true); if (props.onOpen) props.onOpen(); }
      var el = inputRef.current;
      if (!el) return;
      el.focus({ preventScroll: true });
      // Reopening with earlier text: carry on typing after it, not before it.
      try { el.setSelectionRange(el.value.length, el.value.length); } catch (e) { /* not every input type allows it */ }
    }
    var openRef = React.useRef(open);
    openRef.current = open;
    function hide(refocus) {
      if (!openRef.current) return;
      setOpen(false);
      if (props.onClose) props.onClose();
      if (refocus && toggleRef.current) toggleRef.current.focus();
    }
    function submit() {
      var q = value.trim();
      if (q && props.onSubmit) props.onSubmit(q);
    }
    // Keep focus in the field while its own buttons are pressed (Safari doesn't focus buttons on click).
    function keepFocus(e) { if (open) e.preventDefault(); }

    // Arrow keys step from the field through the panel's links and buttons, and back up to the field.
    function stops() { return panelRef.current ? Array.prototype.slice.call(panelRef.current.querySelectorAll('a[href], button:not([disabled])')) : []; }
    function step(from, dir) {
      var list = stops(), i = list.indexOf(from), next = i + dir;
      if (next < 0) { if (inputRef.current) inputRef.current.focus(); return; }
      if (list[Math.min(next, list.length - 1)]) list[Math.min(next, list.length - 1)].focus();
    }
    function onPanelKey(e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); step(document.activeElement, e.key === 'ArrowDown' ? 1 : -1); }
      else if (e.key === 'Escape') { e.preventDefault(); hide(true); }
    }

    return h('div', {
      ref: wrapRef, className: 'rs-nav__search',
      // An empty field closes when focus moves elsewhere on the page, not when the window loses focus.
      onBlur: function () {
        setTimeout(function () {
          var w = wrapRef.current;
          if (w && document.hasFocus() && !w.contains(document.activeElement) && !valueRef.current) hide(false);
        }, 0);
      }
    },
      h('form', {
        ref: formRef, role: 'search', className: cx('rs-search', open && 'is-open', hasPanel && 'has-panel'),
        onSubmit: function (e) { e.preventDefault(); submit(); }
      },
        h('button', {
          ref: toggleRef, type: 'button', className: 'rs-iconbtn rs-iconbtn--ghost rs-iconbtn--md rs-search__toggle',
          'aria-label': 'Search', title: 'Search', 'aria-expanded': open ? 'true' : 'false', 'aria-controls': inputId,
          onMouseDown: keepFocus,
          onClick: function () { if (open && value.trim()) submit(); else show(); }
        }, h(Icon, { name: 'search', size: 20 })),
        h('input', {
          ref: inputRef, id: inputId, type: 'search', className: 'rs-search__input',
          placeholder: props.placeholder || 'Search films and series', 'aria-label': props.placeholder || 'Search films and series',
          autoComplete: 'off', enterKeyHint: 'search', value: value,
          tabIndex: open ? 0 : -1, 'aria-hidden': open ? undefined : 'true', 'aria-controls': hasPanel ? panelId : undefined,
          onFocus: function () { if (!open) show(); },
          onChange: function (e) { setValue(e.target.value); },
          onKeyDown: function (e) {
            if (e.key === 'Escape') { e.preventDefault(); hide(true); }
            else if (e.key === 'ArrowDown' && hasPanel) { e.preventDefault(); step(null, 1); }
          }
        }),
        open ? h('button', {
          type: 'button', className: 'rs-iconbtn rs-iconbtn--ghost rs-iconbtn--sm rs-search__close',
          'aria-label': value ? 'Clear search' : 'Close search', title: value ? 'Clear search' : 'Close search',
          onMouseDown: keepFocus,
          onClick: function () { setValue(''); hide(true); }
        }, h(Icon, { name: 'close', size: 16 })) : null
      ),
      // Results or suggestions the consumer renders, joined to the bottom of the field and as wide as it.
      hasPanel ? h('div', {
        ref: function (el) { panelRef.current = el; if (el) paint(); },
        id: panelId, className: 'rs-search__panel', role: 'region', 'aria-label': props.panelLabel || 'Search results',
        onKeyDown: onPanelKey,
        // Following a link out of the panel closes the search; the text stays for next time.
        onClick: function (e) { if (e.target.closest && e.target.closest('a[href]')) hide(false); }
      }, props.panel) : null
    );
  }

  /* Under 768px the links and bell move into a menu opened from a toggle right of the avatar. */
  function NavBar(props) {
    var links = props.links || [];
    var coverSt = React.useState(null);
    var cover = coverSt[0];
    var menuSt = React.useState(false);
    var menuOpen = menuSt[0], setMenu = menuSt[1];
    var headerRef = React.useRef(null);
    var menuId = 'rs-nav-menu-' + React.useId().replace(/:/g, '');
    function toggle() { return headerRef.current && headerRef.current.querySelector('.rs-nav__menu-toggle'); }
    function closeMenu(refocus) { setMenu(false); if (refocus && toggle()) toggle().focus(); }
    React.useEffect(function () {
      if (!menuOpen) return;
      var first = headerRef.current && headerRef.current.querySelector('.rs-nav__menu [role="menuitem"]');
      if (first) first.focus();
      function onDown(e) {
        var t = e.target;
        if (!(t.closest && t.closest('.rs-nav__menu, .rs-nav__menu-toggle') && headerRef.current.contains(t))) setMenu(false);
      }
      document.addEventListener('pointerdown', onDown);
      return function () { document.removeEventListener('pointerdown', onDown); };
    }, [menuOpen]);
    var menuGroups = [
      links.map(function (l) { return { label: l.label, icon: l.icon, href: l.href || '#', active: l.active }; }),
      [{ label: 'Notifications', icon: 'bell', badge: props.notifications, onClick: function () { setMenu(false); if (props.onNotifications) props.onNotifications(); } }]
    ].filter(function (g) { return g.length; });
    return h('header', { ref: headerRef, className: cx('rs-nav', props.sticky && 'rs-nav--sticky', cover && 'rs-nav--search-' + cover, props.className) },
      h('div', { className: 'rs-nav__inner' },
        h(Wordmark, { brand: props.brand, href: props.homeHref }),
        h('nav', { className: 'rs-nav__links', 'aria-label': 'Primary' },
          h('ul', null, links.map(function (l) {
            return h('li', { key: l.label },
              h('a', { href: l.href || '#', className: cx('rs-nav__link', l.active && 'is-active'), 'aria-current': l.active ? 'page' : undefined }, l.label));
          }))
        ),
        h('div', { className: 'rs-nav__actions' },
          h(NavSearch, {
            placeholder: props.searchPlaceholder, value: props.searchValue, defaultValue: props.defaultSearchValue,
            defaultOpen: props.defaultSearchOpen, onChange: props.onSearchChange, onSubmit: props.onSearchSubmit,
            onOpen: props.onSearch, onClose: props.onSearchClose, onCover: coverSt[1],
            panel: props.searchResults, panelLabel: props.searchResultsLabel
          }),
          h(IconButton, { icon: 'bell', label: props.notifications ? 'Notifications, ' + props.notifications + ' new' : 'Notifications', badge: !!props.notifications, onClick: props.onNotifications, className: 'rs-nav__bell' }),
          h('button', { type: 'button', className: 'rs-avatar', 'aria-label': props.avatarLabel || 'Account', onClick: props.onAccount },
            props.avatarSrc ? h('img', { src: props.avatarSrc, alt: '' }) : h('span', { 'aria-hidden': 'true' }, props.initials || h(Icon, { name: 'user', size: 18 }))),
          h(IconButton, { icon: menuOpen ? 'close' : 'menu', label: 'Menu', className: 'rs-nav__menu-toggle', 'aria-haspopup': 'menu', 'aria-expanded': menuOpen ? 'true' : 'false', 'aria-controls': menuOpen ? menuId : undefined, onClick: function () { setMenu(!menuOpen); } })
        )
      ),
      menuOpen ? h(AccountMenu, { id: menuId, label: 'Menu', className: 'rs-nav__menu', groups: menuGroups, onSelect: function () { setMenu(false); }, onClose: function () { closeMenu(true); } }) : null
    );
  }

  function BottomNav(props) {
    var items = props.items || [];
    var hide = props.hideOnDesktop !== false;
    var fixed = props.fixed !== false;
    return h('nav', { className: cx('rs-bottomnav', hide && 'rs-bottomnav--auto', fixed && 'rs-bottomnav--fixed', props.className), 'aria-label': props.label || 'Primary' },
      h('ul', null, items.map(function (it) {
        return h('li', { key: it.label },
          h('a', { href: it.href || '#', className: cx('rs-bottomnav__item', it.active && 'is-active'), 'aria-current': it.active ? 'page' : undefined },
            h(Icon, { name: it.icon || 'home', size: 22 }),
            h('span', null, it.label)));
      }))
    );
  }

  function Tabs(props) {
    var items = props.items || [];
    var st = React.useState(props.defaultValue || (items[0] && items[0].id));
    var value = props.value !== undefined ? props.value : st[0];
    var refs = React.useRef([]);
    function select(id, i) {
      if (props.value === undefined) st[1](id);
      if (props.onChange) props.onChange(id);
      if (refs.current[i]) refs.current[i].focus();
    }
    function onKey(e, i) {
      var n = items.length, j = -1;
      if (e.key === 'ArrowRight') j = (i + 1) % n;
      else if (e.key === 'ArrowLeft') j = (i - 1 + n) % n;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = n - 1;
      if (j >= 0) { e.preventDefault(); select(items[j].id, j); }
    }
    return h('div', { className: cx('rs-tabs', props.overlay && 'rs-tabs--overlay', props.className) },
      h('div', { className: 'rs-tabs__list', role: 'tablist', 'aria-label': props.label || 'Sections' },
        items.map(function (t, i) {
          var on = t.id === value;
          return h('button', {
            key: t.id, type: 'button', role: 'tab', id: 'tab-' + t.id,
            'aria-selected': on ? 'true' : 'false', 'aria-controls': t.panelId,
            tabIndex: on ? 0 : -1, className: cx('rs-tab', on && 'is-active'),
            ref: function (el) { refs.current[i] = el; },
            onClick: function () { select(t.id, i); },
            onKeyDown: function (e) { onKey(e, i); }
          }, t.label);
        })
      )
    );
  }

  function GenreChips(props) {
    var genres = props.genres || [];
    var st = React.useState(props.defaultSelected || []);
    var selected = props.selected !== undefined ? props.selected : st[0];
    function toggle(g) {
      var next = selected.indexOf(g) >= 0 ? selected.filter(function (x) { return x !== g; }) : selected.concat([g]);
      if (props.selected === undefined) st[1](next);
      if (props.onChange) props.onChange(next);
    }
    // Arrows show at an end with more chips past it, for mouse users who can't swipe the row.
    var list = React.useRef(null);
    var edgeSt = React.useState({ back: false, forward: false });
    var edges = edgeSt[0], setEdges = edgeSt[1];
    React.useEffect(function () {
      var el = list.current;
      if (!el) return;
      function update() {
        var back = el.scrollLeft > 1, forward = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
        setEdges(function (e) { return e.back === back && e.forward === forward ? e : { back: back, forward: forward }; });
      }
      update();
      el.addEventListener('scroll', update, { passive: true });
      var ro = window.ResizeObserver ? new ResizeObserver(update) : null;
      if (ro) ro.observe(el);
      return function () { el.removeEventListener('scroll', update); if (ro) ro.disconnect(); };
    }, [genres.length]);
    function scroll(dir) {
      if (list.current) list.current.scrollBy({ left: dir * list.current.clientWidth * 0.7, behavior: 'smooth' });
    }
    function arrow(dir) {
      var back = dir < 0;
      return h('div', { className: cx('rs-chips__arrow', back ? 'rs-chips__arrow--l' : 'rs-chips__arrow--r', (back ? edges.back : edges.forward) && 'is-shown') },
        h(IconButton, { icon: back ? 'chevronLeft' : 'chevronRight', label: back ? 'Scroll genres back' : 'Scroll genres forward', variant: 'filled', tabIndex: -1, 'aria-hidden': 'true', onClick: function () { scroll(dir); } }));
    }
    return h('div', { className: cx('rs-chips', props.className) },
      arrow(-1),
      h('div', { className: 'rs-chips__list', ref: list, role: 'group', 'aria-label': props.label || 'Filter by genre' },
        genres.map(function (g) {
          var on = selected.indexOf(g) >= 0;
          return h('button', { key: g, type: 'button', className: cx('rs-chip', on && 'is-selected'), 'aria-pressed': on ? 'true' : 'false', onClick: function () { toggle(g); } },
            on ? h(Icon, { name: 'check', size: 14 }) : null, h('span', null, g));
        })
      ),
      arrow(1)
    );
  }

  function AgeBadge(props) {
    return h('span', { className: cx('rs-age', props.className), 'aria-label': 'Rated ' + props.rating }, props.rating);
  }

  function RatingBadge(props) {
    var max = props.max || 10;
    var v = Number(props.value);
    var tone = props.tone || 'gold';
    return h('span', { className: cx('rs-score', 'rs-score--' + tone, 'rs-score--' + (props.size || 'sm'), props.className), 'aria-label': 'Rated ' + v.toFixed(1) + ' out of ' + max + (props.votes ? ', ' + props.votes + ' ratings' : '') },
      h(Icon, { name: 'star', size: props.size === 'md' ? 16 : 13 }),
      h('span', { 'aria-hidden': 'true' }, v.toFixed(1)),
      props.votes ? h('span', { className: 'rs-score__votes', 'aria-hidden': 'true' }, '(' + props.votes + ')') : null
    );
  }

  /* value: 0–10, in whole points; each star is two points (a half star = 1). */
  function RatingInput(props) {
    var st = React.useState(props.defaultValue || 0);
    var value = props.value !== undefined ? props.value : st[0];
    var hv = React.useState(0);
    var shown = hv[0] || value;
    var refs = React.useRef([]);
    function set(n) {
      n = Math.max(1, Math.min(10, n));
      if (props.value === undefined) st[1](n);
      if (props.onChange) props.onChange(n);
      if (refs.current[n - 1]) refs.current[n - 1].focus();
    }
    function onKey(e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); set((value || 0) + 1); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); set((value || 2) - 1); }
      else if (e.key === 'Home') { e.preventDefault(); set(1); }
      else if (e.key === 'End') { e.preventDefault(); set(10); }
    }
    var stars = [];
    for (var i = 1; i <= 5; i++) {
      var fill = shown >= i * 2 ? '100%' : shown === i * 2 - 1 ? '50%' : '0%';
      var halves = [i * 2 - 1, i * 2].map(function (n, k) {
        var focusable = value ? n === value : n === 1;
        return h('button', {
          key: k, type: 'button', role: 'radio',
          className: 'rs-rate__hit rs-rate__hit--' + (k ? 'r' : 'l'),
          'aria-checked': n === value ? 'true' : 'false',
          'aria-label': (n / 2) + (n === 2 ? ' star' : ' stars'),
          tabIndex: focusable ? 0 : -1,
          ref: function (el) { refs.current[n - 1] = el; },
          onClick: function () { set(n); },
          onMouseEnter: function () { hv[1](n); },
          onKeyDown: onKey
        });
      });
      stars.push(h('span', { key: i, className: 'rs-rate__star' },
        h(Icon, { name: 'star', size: 28, className: 'rs-rate__base' }),
        h('span', { className: 'rs-rate__fill', style: { width: fill } }, h(Icon, { name: 'star', size: 28 })),
        halves));
    }
    return h('div', { className: cx('rs-rate', props.className) },
      h('div', { className: 'rs-rate__stars', role: 'radiogroup', 'aria-label': props.label || 'Your rating', onMouseLeave: function () { hv[1](0); } }, stars),
      h('span', { className: 'rs-rate__readout', 'aria-live': 'polite' }, value ? value + ' / 10' : (props.placeholder || 'Tap to rate'))
    );
  }

  function Poster(props) {
    if (props.src) return h('img', { className: 'rs-poster__img', src: props.src, alt: '', loading: 'lazy' });
    return h('span', { className: cx('rs-poster__fallback', 'rs-poster__fallback--' + (props.tone || 'night')), 'aria-hidden': 'true' },
      h('span', null, (props.title || '?').charAt(0)));
  }

  function MovieCard(props) {
    var titleId = React.useId ? React.useId() : undefined;
    var meta = [props.year, props.kind].filter(Boolean).join(' · ');
    return h('article', { className: cx('rs-card', props.className), 'aria-labelledby': titleId },
      h('a', { className: 'rs-card__poster', href: props.href || '#', 'aria-labelledby': titleId },
        h(Poster, { src: props.poster, title: props.title, tone: props.tone })),
      h('h3', { className: 'rs-card__title', id: titleId, title: props.title }, props.title),
      h('div', { className: 'rs-card__meta' },
        h('span', { className: 'rs-card__year' }, meta),
        h('span', { className: 'rs-card__actions' },
          props.onLike !== undefined || props.liked !== undefined ? h(IconButton, { icon: 'heart', size: 'sm', label: 'Like ' + props.title, pressed: !!props.liked, onClick: props.onLike, className: 'rs-card__like' }) : null,
          props.onWatched !== undefined || props.watched !== undefined ? h(IconButton, { icon: 'eye', size: 'sm', label: 'Mark ' + props.title + ' as watched', pressed: !!props.watched, onClick: props.onWatched, className: 'rs-card__watched' }) : null,
          props.rating !== undefined ? h(RatingBadge, { value: props.rating }) : null
        )
      )
    );
  }

  function PosterRow(props) {
    var track = React.useRef(null);
    function scroll(dir) {
      var el = track.current;
      if (!el) return;
      el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
    }
    var headingId = React.useId ? React.useId() : undefined;
    return h('section', { className: cx('rs-row', props.className), 'aria-labelledby': props.title ? headingId : undefined, 'aria-label': props.title ? undefined : props.label },
      props.title ? h('div', { className: 'rs-row__head' },
        h('h2', { className: 'rs-row__title', id: headingId }, props.title),
        props.seeAllHref ? h('a', { className: 'rs-row__all', href: props.seeAllHref }, 'See all') : null) : null,
      h('div', { className: 'rs-row__frame' },
        h(IconButton, { icon: 'chevronLeft', label: 'Scroll back', variant: 'scrim', size: 'lg', className: 'rs-row__arrow rs-row__arrow--l', onClick: function () { scroll(-1); } }),
        h('ul', { className: 'rs-row__track', ref: track },
          React.Children.map(props.children, function (c, i) { return h('li', { key: i, className: 'rs-row__item' }, c); })),
        h(IconButton, { icon: 'chevronRight', label: 'Scroll forward', variant: 'scrim', size: 'lg', className: 'rs-row__arrow rs-row__arrow--r', onClick: function () { scroll(1); } })
      )
    );
  }

  function Hero(props) {
    var meta = [];
    if (props.rating !== undefined) meta.push(h(RatingBadge, { key: 'r', value: props.rating, tone: 'brand', size: 'md' }));
    if (props.year) meta.push(h('span', { key: 'y' }, props.year));
    if (props.length) meta.push(h('span', { key: 'l' }, props.length));
    return h('section', { className: cx('rs-hero', props.className), 'aria-label': props.title },
      h('div', { className: 'rs-hero__art', 'aria-hidden': 'true' },
        props.image ? h('img', { src: props.image, alt: '', style: props.focalPoint ? { objectPosition: props.focalPoint } : undefined }) : null),
      h('div', { className: 'rs-hero__body' },
        props.ageRating ? h(AgeBadge, { rating: props.ageRating }) : null,
        meta.length ? h('div', { className: 'rs-hero__meta' }, meta) : null,
        h('h1', { className: 'rs-hero__title' }, props.title),
        props.synopsis ? h('p', { className: 'rs-hero__synopsis' }, props.synopsis) : null,
        h('div', { className: 'rs-hero__actions' },
          h(Button, { variant: 'primary', icon: 'play', onClick: props.onWatch }, props.watchLabel || 'Watch trailer'),
          props.showAddToList ? h(Button, { variant: 'secondary', icon: 'plus', onClick: props.onAddToList }, props.addLabel || 'Add to list') : null)
      ),
      props.children ? h('div', { className: 'rs-hero__foot' }, props.children) : null
    );
  }

  /* Official TMDB "alt short" logo (light-blue to green gradient, legible on surface-0), from
     themoviedb.org/about/logos-attribution. Embedded so it renders without loading anything from TMDB. */
  var TMDB_LOGO = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMjczLjQyIDM1LjUyIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6dXJsKCNsaW5lYXItZ3JhZGllbnQpO308L3N0eWxlPjxsaW5lYXJHcmFkaWVudCBpZD0ibGluZWFyLWdyYWRpZW50IiB5MT0iMTcuNzYiIHgyPSIyNzMuNDIiIHkyPSIxNy43NiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzkwY2VhMSIvPjxzdG9wIG9mZnNldD0iMC41NiIgc3RvcC1jb2xvcj0iIzNjYmVjOSIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwYjNlNSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjx0aXRsZT5Bc3NldCAzPC90aXRsZT48ZyBpZD0iTGF5ZXJfMiIgZGF0YS1uYW1lPSJMYXllciAyIj48ZyBpZD0iTGF5ZXJfMS0yIiBkYXRhLW5hbWU9IkxheWVyIDEiPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTE5MS44NSwzNS4zN2g2My45QTE3LjY3LDE3LjY3LDAsMCwwLDI3My40MiwxNy43aDBBMTcuNjcsMTcuNjcsMCwwLDAsMjU1Ljc1LDBoLTYzLjlBMTcuNjcsMTcuNjcsMCwwLDAsMTc0LjE4LDE3LjdoMEExNy42NywxNy42NywwLDAsMCwxOTEuODUsMzUuMzdaTTEwLjEsMzUuNDJoNy44VjYuOTJIMjhWMEgwdjYuOUgxMC4xWm0yOC4xLDBINDZWOC4yNWguMUw1NS4wNSwzNS40aDZMNzAuMyw4LjI1aC4xVjM1LjRoNy44VjBINjYuNDVsLTguMiwyMy4xaC0uMUw1MCwwSDM4LjJaTTg5LjE0LjEyaDExLjdhMzMuNTYsMzMuNTYsMCwwLDEsOC4wOCwxLDE4LjUyLDE4LjUyLDAsMCwxLDYuNjcsMy4wOCwxNS4wOSwxNS4wOSwwLDAsMSw0LjUzLDUuNTIsMTguNSwxOC41LDAsMCwxLDEuNjcsOC4yNSwxNi45MSwxNi45MSwwLDAsMS0xLjYyLDcuNTgsMTYuMywxNi4zLDAsMCwxLTQuMzgsNS41LDE5LjI0LDE5LjI0LDAsMCwxLTYuMzUsMy4zNywyNC41MywyNC41MywwLDAsMS03LjU1LDEuMTVIODkuMTRabTcuOCwyOC4yaDRhMjEuNjYsMjEuNjYsMCwwLDAsNS0uNTVBMTAuNTgsMTAuNTgsMCwwLDAsMTEwLDI2YTguNzMsOC43MywwLDAsMCwyLjY4LTMuMzUsMTEuOSwxMS45LDAsMCwwLDEtNS4wOCw5Ljg3LDkuODcsMCwwLDAtMS00LjUyLDkuMTcsOS4xNywwLDAsMC0yLjYzLTMuMThBMTEuNjEsMTEuNjEsMCwwLDAsMTA2LjIyLDhhMTcuMDYsMTcuMDYsMCwwLDAtNC42OC0uNjNoLTQuNlpNMTMzLjA5LjEyaDEzLjJhMzIuODcsMzIuODcsMCwwLDEsNC42My4zMywxMi42NiwxMi42NiwwLDAsMSw0LjE3LDEuMyw3Ljk0LDcuOTQsMCwwLDEsMywyLjcyLDguMzQsOC4zNCwwLDAsMSwxLjE1LDQuNjUsNy40OCw3LjQ4LDAsMCwxLTEuNjcsNSw5LjEzLDkuMTMsMCwwLDEtNC40MywyLjgyVjE3YTEwLjI4LDEwLjI4LDAsMCwxLDMuMTgsMSw4LjUxLDguNTEsMCwwLDEsMi40NSwxLjg1LDcuNzksNy43OSwwLDAsMSwxLjU3LDIuNjIsOS4xNiw5LjE2LDAsMCwxLC41NSwzLjIsOC41Miw4LjUyLDAsMCwxLTEuMiw0LjY4LDkuMzIsOS4zMiwwLDAsMS0zLjEsM0ExMy4zOCwxMy4zOCwwLDAsMSwxNTIuMzIsMzVhMjIuNSwyMi41LDAsMCwxLTQuNzMuNWgtMTQuNVptNy44LDE0LjE1aDUuNjVhNy42NSw3LjY1LDAsMCwwLDEuNzgtLjIsNC43OCw0Ljc4LDAsMCwwLDEuNTctLjY1LDMuNDMsMy40MywwLDAsMCwxLjEzLTEuMiwzLjYzLDMuNjMsMCwwLDAsLjQyLTEuOEEzLjMsMy4zLDAsMCwwLDE1MSw4LjZhMy40MiwzLjQyLDAsMCwwLTEuMjMtMS4xM0E2LjA3LDYuMDcsMCwwLDAsMTQ4LDYuOWE5LjksOS45LDAsMCwwLTEuODUtLjE4aC01LjNabTAsMTQuNjVoN2E4LjI3LDguMjcsMCwwLDAsMS44My0uMiw0LjY3LDQuNjcsMCwwLDAsMS42Ny0uNywzLjkzLDMuOTMsMCwwLDAsMS4yMy0xLjMsMy44LDMuOCwwLDAsMCwuNDctMS45NSwzLjE2LDMuMTYsMCwwLDAtLjYyLTIsNCw0LDAsMCwwLTEuNTgtMS4xOCw4LjIzLDguMjMsMCwwLDAtMi0uNTUsMTUuMTIsMTUuMTIsMCwwLDAtMi4wNS0uMTVoLTUuOVoiLz48L2c+PC9nPjwvc3ZnPg==';

  /* Site footer with the attribution TMDB's terms require: their logo (less prominent than ours) and the notice. */
  function Footer(props) {
    var links = props.links || [];
    var product = props.productType || 'website';
    return h('footer', { className: cx('rs-footer', props.className) },
      h('div', { className: 'rs-footer__inner' },
        h('div', { className: 'rs-footer__top' },
          h(Wordmark, { brand: props.brand, href: props.homeHref }),
          links.length ? h('nav', { className: 'rs-footer__links', 'aria-label': props.label || 'Footer' },
            h('ul', null, links.map(function (l) {
              return h('li', { key: l.label }, h('a', { href: l.href || '#', className: 'rs-footer__link' }, l.label));
            }))) : null
        ),
        h('div', { className: 'rs-footer__attr' },
          h('a', { className: 'rs-footer__tmdb', href: 'https://www.themoviedb.org/', target: '_blank', rel: 'noopener noreferrer' },
            h('img', { src: props.tmdbLogoSrc || TMDB_LOGO, alt: 'TMDB', width: 108, height: 14 })),
          h('p', { className: 'rs-footer__notice' }, 'This ' + product + ' uses TMDB and the TMDB APIs but is not endorsed, certified, or otherwise approved by TMDB.')
        ),
        props.copyright ? h('p', { className: 'rs-footer__legal' }, props.copyright) : null,
        h('p', { className: 'rs-footer__legal rs-footer__credit' }, props.designCredit || 'Movie reel design by Jake.')
      )
    );
  }

  /* A film strip of cast members: sprocketed frames with the name and role printed below the reel. */
  var STRIP_TONES = ['night', 'red', 'slate', 'gold'];
  function initialsOf(name) {
    var parts = String(name || '').trim().split(/\s+/);
    return ((parts[0] || '').charAt(0) + (parts.length > 1 ? parts[parts.length - 1].charAt(0) : '')).toUpperCase();
  }
  function Sprockets(props) {
    var holes = [];
    for (var i = 0; i < props.count; i++) holes.push(h('span', { key: i }));
    return h('div', { className: cx('rs-strip__holes', props.bottom && 'rs-strip__holes--bottom'), 'aria-hidden': 'true' }, holes);
  }

  function CastStrip(props) {
    var people = props.people || [];
    var items = [];
    if (props.title) {
      items.push(h('li', { key: 'leader', className: 'rs-strip__item rs-strip__item--leader', 'aria-hidden': 'true' },
        h('div', { className: 'rs-strip__film' },
          h(Sprockets, { count: 4 }),
          h('div', { className: 'rs-strip__leader' },
            h('span', { className: 'rs-strip__reel' }, props.reel || 'Reel 1'),
            h('span', { className: 'rs-strip__meta' }, props.title),
            h('span', { className: 'rs-strip__meta' }, 'Cast · ' + people.length)),
          h(Sprockets, { count: 4, bottom: true }))));
    }
    people.forEach(function (p, i) {
      var n = i + 1;
      var tone = p.tone || STRIP_TONES[i % STRIP_TONES.length];
      var picture = p.photo ? h('img', { src: p.photo, alt: '', loading: 'lazy' }) : h('span', { 'aria-hidden': 'true' }, initialsOf(p.name));
      var frameClass = cx('rs-strip__frame', 'rs-strip__frame--' + tone);
      var frame = p.href
        ? h('a', { className: frameClass, href: p.href, 'aria-label': p.role ? p.name + ' as ' + p.role : p.name }, picture)
        : h('div', { className: frameClass, 'aria-hidden': 'true' }, picture);
      items.push(h('li', { key: p.id || p.name + '-' + i, className: 'rs-strip__item' },
        h('div', { className: 'rs-strip__film' },
          h(Sprockets, { count: 6 }),
          h('div', { className: 'rs-strip__code', 'aria-hidden': 'true' },
            h('span', null, '▸ ' + (n < 10 ? '0' : '') + n + 'A'),
            h('span', null, props.stock || 'RS 5219')),
          frame,
          h(Sprockets, { count: 6, bottom: true })),
        h('div', { className: 'rs-strip__caption' },
          h('span', { className: 'rs-strip__name', title: p.name }, p.name),
          p.role ? h('span', { className: 'rs-strip__role', title: p.role }, p.role) : null)));
    });
    return h('div', { className: cx('rs-strip', props.shimmer === false && 'rs-strip--still', props.className) },
      h('ul', { className: 'rs-strip__list', 'aria-label': props.label || (props.title ? 'Cast of ' + props.title : 'Cast') }, items));
  }

  var ACCOUNT_ITEMS = [
    [{ label: 'My ratings', icon: 'star' }, { label: 'My favorites', icon: 'heart' }],
    [{ label: 'Settings', icon: 'settings' }, { label: 'Profile', icon: 'user' }]
  ];

  /* One row of the account menu: a 24px icon and a label, with an optional count. A link when it has an href, else a button. */
  function AccountMenuItem(props) {
    var inner = [
      props.icon ? h('span', { key: 'i', className: 'rs-account__icon' }, h(Icon, { name: props.icon })) : null,
      h('span', { key: 'l', className: 'rs-account__label' }, props.label),
      props.badge ? h('span', { key: 'b', className: 'rs-account__badge' }, props.badge) : null
    ];
    var cls = cx('rs-account__item', props.active && 'is-active', props.className);
    return props.href
      ? h('a', { href: props.href, role: 'menuitem', className: cls, onClick: props.onClick, 'aria-current': props.active ? 'page' : undefined }, inner)
      : h('button', { type: 'button', role: 'menuitem', className: cls, onClick: props.onClick }, inner);
  }

  /* The hairline between groups of account menu rows. */
  function AccountMenuDivider(props) {
    return h('div', { className: cx('rs-account__sep', props.className), role: 'separator' });
  }

  /* The menu under the NavBar's avatar: icon + label rows, with a divider between groups. Arrow keys move between rows. */
  function AccountMenu(props) {
    var groups = props.groups || ACCOUNT_ITEMS;
    var ref = React.useRef(null);
    function rows() { return ref.current ? Array.prototype.slice.call(ref.current.querySelectorAll('[role="menuitem"]')) : []; }
    function onKeyDown(e) {
      if (e.key === 'Escape') { if (props.onClose) props.onClose(); return; }
      var list = rows(), i = list.indexOf(document.activeElement), j = -1;
      if (e.key === 'ArrowDown') j = (i + 1) % list.length;
      else if (e.key === 'ArrowUp') j = (i - 1 + list.length) % list.length;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = list.length - 1;
      if (j < 0) return;
      e.preventDefault();
      list[j].focus();
    }
    var out = [];
    groups.forEach(function (group, g) {
      if (g > 0) out.push(h(AccountMenuDivider, { key: 'sep' + g }));
      group.forEach(function (it) {
        out.push(h(AccountMenuItem, { key: it.label, label: it.label, icon: it.icon, href: it.href, active: it.active, badge: it.badge, onClick: it.onClick || props.onSelect && function () { props.onSelect(it); } }));
      });
    });
    return h('div', { ref: ref, id: props.id, role: 'menu', 'aria-label': props.label || 'Account', className: cx('rs-account', props.className), onKeyDown: onKeyDown }, out);
  }

  window.Reelscore = Object.assign(window.Reelscore || {}, {
    Icon: Icon, Button: Button, IconButton: IconButton, NavBar: NavBar, BottomNav: BottomNav,
    Tabs: Tabs, GenreChips: GenreChips, AgeBadge: AgeBadge, RatingBadge: RatingBadge,
    RatingInput: RatingInput, MovieCard: MovieCard, PosterRow: PosterRow, Hero: Hero, Footer: Footer, CastStrip: CastStrip, AccountMenuItem: AccountMenuItem, AccountMenuDivider: AccountMenuDivider, AccountMenu: AccountMenu
  });
})();
