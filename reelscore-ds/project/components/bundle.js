/* @ds-bundle: {"format":4,"namespace":"Reelscore","components":[{"name":"Icon"},{"name":"Button"},{"name":"IconButton"},{"name":"NavBar"},{"name":"BottomNav"},{"name":"Tabs"},{"name":"GenreChips"},{"name":"AgeBadge"},{"name":"RatingBadge"},{"name":"RatingInput"},{"name":"MovieCard"},{"name":"PosterRow"},{"name":"Hero"},{"name":"Footer"},{"name":"CastStrip"}]} */
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
    user: 'M12 3a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm0 11c4.4 0 8 2.2 8 5v2H4v-2c0-2.8 3.6-5 8-5z'
  };

  function Icon(props) {
    var size = props.size || 20;
    var d = PATHS[props.name] || PATHS.star;
    var a11y = props.title ? { role: 'img', 'aria-label': props.title } : { 'aria-hidden': 'true', focusable: 'false' };
    return h('svg', Object.assign({
      className: cx('rs-icon', props.className),
      width: size, height: size, viewBox: '0 0 24 24', fill: 'currentColor'
    }, a11y), h('path', { d: d, fillRule: 'evenodd', clipRule: 'evenodd' }));
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

  function NavBar(props) {
    var links = props.links || [];
    return h('header', { className: cx('rs-nav', props.sticky && 'rs-nav--sticky', props.className) },
      h('div', { className: 'rs-nav__inner' },
        h(Wordmark, { brand: props.brand, href: props.homeHref }),
        h('nav', { className: 'rs-nav__links', 'aria-label': 'Primary' },
          h('ul', null, links.map(function (l) {
            return h('li', { key: l.label },
              h('a', { href: l.href || '#', className: cx('rs-nav__link', l.active && 'is-active'), 'aria-current': l.active ? 'page' : undefined }, l.label));
          }))
        ),
        h('div', { className: 'rs-nav__actions' },
          h(IconButton, { icon: 'search', label: 'Search', onClick: props.onSearch }),
          h(IconButton, { icon: 'bell', label: props.notifications ? 'Notifications, ' + props.notifications + ' new' : 'Notifications', badge: !!props.notifications, onClick: props.onNotifications, className: 'rs-nav__bell' }),
          h('button', { type: 'button', className: 'rs-avatar', 'aria-label': props.avatarLabel || 'Account', onClick: props.onAccount },
            props.avatarSrc ? h('img', { src: props.avatarSrc, alt: '' }) : h('span', { 'aria-hidden': 'true' }, props.initials || h(Icon, { name: 'user', size: 18 })))
        )
      )
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
    return h('div', { className: cx('rs-chips', props.className) },
      h('div', { className: 'rs-chips__list', role: 'group', 'aria-label': props.label || 'Filter by genre' },
        genres.map(function (g) {
          var on = selected.indexOf(g) >= 0;
          return h('button', { key: g, type: 'button', className: cx('rs-chip', on && 'is-selected'), 'aria-pressed': on ? 'true' : 'false', onClick: function () { toggle(g); } },
            on ? h(Icon, { name: 'check', size: 14 }) : null, h('span', null, g));
        })
      )
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

  window.Reelscore = Object.assign(window.Reelscore || {}, {
    Icon: Icon, Button: Button, IconButton: IconButton, NavBar: NavBar, BottomNav: BottomNav,
    Tabs: Tabs, GenreChips: GenreChips, AgeBadge: AgeBadge, RatingBadge: RatingBadge,
    RatingInput: RatingInput, MovieCard: MovieCard, PosterRow: PosterRow, Hero: Hero, Footer: Footer, CastStrip: CastStrip
  });
})();
