import { useEffect, useState } from 'react';
import { Button, RatingBadge, Tabs } from 'reelscore';
import { catalog, type Credit, type CreditGroup, type PersonDetails, type Title } from '../api';
import { TitleCard } from '../components/TitleRow';
import { useAsync } from '../hooks/useAsync';
import type { LibraryApi } from '../hooks/useLibrary';
import { titleHref } from '../router';
import { formatDate, initials, shorten } from '../text';

const CREDITS_SHOWN = 20;
/** A biography longer than this starts folded. */
const BIO_FOLDED = 600;
/* Below this many votes a score is too noisy to call someone's highest rated. */
const MIN_VOTES_FOR_BEST = 100;
const SELF = /^(self|himself|herself|themselves)\b/i;

interface PersonPageProps {
  id: string;
  library: LibraryApi;
}

export function PersonPage({ id, library }: PersonPageProps) {
  const [state, retry] = useAsync((signal) => catalog.getPerson(id, signal), [id]);

  const name = state.status === 'ready' ? state.data.name : undefined;
  useEffect(() => {
    if (!name) return;
    document.title = `${name} — Reelscore`;
    return () => {
      document.title = 'Reelscore';
    };
  }, [name]);

  if (state.status === 'loading') {
    return (
      <div className="hero-placeholder" aria-busy="true">
        <div className="hero-placeholder__body" />
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <section className="row-status title-error" aria-label="Person">
        <h1 className="row-status__title">This page didn&rsquo;t load</h1>
        <p>Check your connection and try again.</p>
        <button type="button" className="row-status__retry" onClick={retry}>
          Try again
        </button>
      </section>
    );
  }

  return <PersonView p={state.data} library={library} />;
}

const today = () => new Date().toISOString().slice(0, 10);
const isUpcoming = (c: Credit) => !c.date || c.date > today();
const yearOf = (iso?: string) => iso?.slice(0, 4);
const plural = (n: number, word: string) => `${n.toLocaleString('en-US')} ${word}${n === 1 ? '' : 's'}`;

/** Whole years between two ISO dates. */
function yearsBetween(from: string, to: string) {
  const [fy, fm, fd] = from.split('-').map(Number);
  const [ty, tm, td] = to.split('-').map(Number);
  return ty - fy - (tm < fm || (tm === fm && td < fd) ? 1 : 0);
}

const paragraphsOf = (text?: string) => (text ?? '').split(/\n+/).map((p) => p.trim()).filter(Boolean);

/** "as Maggie Dunne" for a character, "Self" for appearing as themselves, the jobs for crew. */
function roleLabel(department: string, role?: string) {
  if (!role || department !== 'Acting') return role;
  return SELF.test(role) ? 'Self' : `as ${role}`;
}

/** Each title once across every department, counted by kind. */
function titleCounts(groups: CreditGroup[]) {
  const titles = new Map<string, Title>();
  for (const g of groups) for (const c of g.credits) titles.set(c.title.id, c.title);
  const all = [...titles.values()];
  return { films: all.filter((t) => t.kind === 'movie').length, series: all.filter((t) => t.kind === 'series').length };
}

/** Their best-scored released title, with the role from their main department. */
function highestRated(groups: CreditGroup[]) {
  let best: { credit: Credit; department: string } | undefined;
  for (const g of groups) {
    for (const c of g.credits) {
      const r = c.title.rating;
      if (r === undefined || (c.title.voteCount ?? 0) < MIN_VOTES_FOR_BEST) continue;
      if (!best || r > best.credit.title.rating!) best = { credit: c, department: g.department };
    }
  }
  return best;
}

/**
 * Their earliest released film, not counting appearances as themselves. Series are left out: TMDB
 * dates a series credit by the show's first episode (an awards show can date back to the 1940s).
 */
function firstFilm(groups: CreditGroup[]) {
  return groups
    .flatMap((g) => g.credits.filter((c) => !(g.department === 'Acting' && c.role && SELF.test(c.role))))
    .filter((c) => c.title.kind === 'movie' && !isUpcoming(c))
    .reduce<Credit | undefined>((first, c) => (!first || c.date! < first.date! ? c : first), undefined);
}

function PersonView({ p, library }: { p: PersonDetails; library: LibraryApi }) {
  const bio = paragraphsOf(p.biography);
  const counts = titleCounts(p.credits);
  const totalCredits = p.credits.reduce((n, g) => n + g.credits.length, 0);
  const directing = p.department !== 'Directing' ? p.credits.find((g) => g.department === 'Directing') : undefined;
  const backdrop = p.knownFor.find((t) => t.backdropUrl);

  // Tabs jump to sections; only offer the ones this person has.
  const tabs = [
    p.knownFor.length > 0 && { id: 'known-for', label: 'Known for' },
    { id: 'biography', label: 'Biography' },
    totalCredits > 0 && { id: 'filmography', label: 'Filmography' },
    { id: 'details', label: 'Details' },
  ].filter((x): x is { id: string; label: string } => Boolean(x));
  const [section, setSection] = useState(tabs[0].id);

  function jumpTo(sectionId: string) {
    setSection(sectionId);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(sectionId)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }

  const lived = p.birthday && p.deathday ? `${yearOf(p.birthday)} – ${yearOf(p.deathday)}` : undefined;
  const born = p.birthday && !p.deathday ? `Born ${formatDate(p.birthday)} (age ${yearsBetween(p.birthday, today())})` : undefined;
  const meta = [lived ?? born, p.birthplace].filter(Boolean).join(' · ');
  const stats = [
    counts.films > 0 && plural(counts.films, 'film'),
    counts.series > 0 && `${counts.series.toLocaleString('en-US')} series`,
    directing && `${directing.credits.length.toLocaleString('en-US')} as director`,
  ].filter((x): x is string => Boolean(x));

  return (
    <>
      <header className="person-hero">
        <div className="person-hero__art" aria-hidden="true">
          {backdrop && <img src={backdrop.backdropUrl} alt="" />}
        </div>
        <div className="person-hero__scrim" aria-hidden="true" />

        <div className="person-hero__body">
          <div className="person-hero__portrait">
            {p.photoUrl ? <img src={p.photoUrl} alt="" /> : <span aria-hidden="true">{initials(p.name)}</span>}
          </div>
          {p.credits.length > 0 && (
            <p className="person-hero__eyebrow">
              {p.credits
                .slice(0, 3)
                .map((g) => g.department)
                .join(' · ')}
            </p>
          )}
          <h1 className="person-hero__name">{p.name}</h1>
          {meta && <p className="person-hero__meta">{meta}</p>}
          {bio[0] && <p className="person-hero__summary">{shorten(bio[0], 160)}</p>}
          {stats.length > 0 && (
            <ul className="title-genres person-hero__stats" aria-label="Credits">
              {stats.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          )}
          {backdrop && (
            <p className="person-hero__credit">
              Backdrop from{' '}
              <a href={titleHref(backdrop.id)}>
                {backdrop.title}
                {backdrop.year && ` (${backdrop.year})`}
              </a>
            </p>
          )}
        </div>

        <Tabs
          label="Person sections"
          overlay
          items={tabs.map((tab) => ({ ...tab, panelId: tab.id }))}
          value={section}
          onChange={jumpTo}
        />
      </header>

      {p.knownFor.length > 0 && (
        <section id="known-for" className="person-known title-section" aria-labelledby="known-for-title">
          <h2 id="known-for-title" className="title-section__title">
            Known for
          </h2>
          <ol className="list-grid">
            {p.knownFor.map((t) => (
              <li key={t.id}>
                <TitleCard title={t} library={library} />
              </li>
            ))}
          </ol>
        </section>
      )}

      <div className="title-body">
        <div className="title-main">
          <Biography name={p.name} paragraphs={bio} />
          {totalCredits > 0 && <Filmography groups={p.credits} total={totalCredits} />}
        </div>

        <aside className="title-aside" aria-label={`About ${p.name}`}>
          <Details p={p} counts={counts} />
          <HighestRated groups={p.credits} />
          <Elsewhere links={p.links} />
        </aside>
      </div>
    </>
  );
}

function Biography({ name, paragraphs }: { name: string; paragraphs: string[] }) {
  const [open, setOpen] = useState(false);
  const length = paragraphs.join(' ').length;
  const folds = length > BIO_FOLDED;

  // Folded: as many whole paragraphs as fit, or the first one cut short.
  let shown = paragraphs;
  if (folds && !open) {
    shown = [];
    let used = 0;
    for (const para of paragraphs) {
      if (used + para.length > BIO_FOLDED) break;
      shown.push(para);
      used += para.length;
    }
    if (shown.length === 0) shown = [shorten(paragraphs[0], BIO_FOLDED)!];
  }

  return (
    <section id="biography" className="title-section" aria-labelledby="biography-title">
      <h2 id="biography-title" className="title-section__title">
        Biography
      </h2>
      {paragraphs.length === 0 ? (
        <p className="title-empty">There&rsquo;s no biography for {name} yet.</p>
      ) : (
        <div id="biography-text" className="person-bio">
          {shown.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      )}
      {folds && (
        <button
          type="button"
          className="title-link person-more"
          aria-expanded={open}
          aria-controls="biography-text"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Show less' : 'Read the full biography'}
        </button>
      )}
    </section>
  );
}

function Filmography({ groups, total }: { groups: CreditGroup[]; total: number }) {
  const [department, setDepartment] = useState(groups[0].department);
  const [all, setAll] = useState(false);
  const group = groups.find((g) => g.department === department) ?? groups[0];
  const shown = all ? group.credits : group.credits.slice(0, CREDITS_SHOWN);

  function pick(id: string) {
    setDepartment(id);
    setAll(false);
  }

  return (
    <section id="filmography" className="title-section title-section-anchor" aria-labelledby="filmography-title">
      <h2 id="filmography-title" className="title-section__title">
        Filmography <span className="title-section__count">&middot; {total.toLocaleString('en-US')}</span>
      </h2>

      {groups.length > 1 && (
        <Tabs
          label="Credits by department"
          items={groups.map((g) => ({
            id: g.department,
            label: `${g.department} · ${g.credits.length.toLocaleString('en-US')}`,
            panelId: 'filmography-credits',
          }))}
          value={group.department}
          onChange={pick}
        />
      )}

      <div id="filmography-credits" role={groups.length > 1 ? 'tabpanel' : undefined}>
        <ol className="person-credits" aria-label={`${group.department} credits, newest first`}>
          {shown.map((c, i) => (
            <CreditRow key={c.title.id} credit={c} department={group.department} previous={shown[i - 1]} />
          ))}
        </ol>
      </div>

      {group.credits.length > CREDITS_SHOWN && (
        <div className="person-credits__more">
          <Button variant="secondary" onClick={() => setAll((a) => !a)} aria-controls="filmography-credits">
            {all ? 'Show fewer' : `Show all ${group.credits.length.toLocaleString('en-US')}`}
          </Button>
        </div>
      )}
    </section>
  );
}

function CreditRow({ credit: c, department, previous }: { credit: Credit; department: string; previous?: Credit }) {
  const t = c.title;
  const label = (x: Credit) => (isUpcoming(x) ? 'Soon' : yearOf(x.date));
  const year = label(c);
  const kind = t.kind === 'series' ? ['Series', c.episodes && plural(c.episodes, 'episode')] : ['Film'];
  const role = roleLabel(department, c.role);

  return (
    <li className="person-credit">
      {/* A year shows once, at the first of its titles. */}
      <span className="person-credit__year">{previous && label(previous) === year ? '' : year}</span>
      {t.posterUrl ? (
        <img className="person-credit__thumb" src={t.posterUrl} alt="" loading="lazy" />
      ) : (
        <span className="person-credit__thumb" aria-hidden="true" />
      )}
      <span className="person-credit__text">
        <a className="person-credit__title" href={titleHref(t.id)}>
          {t.title}
        </a>
        {role && <span className="person-credit__role">{role}</span>}
        <span className="person-credit__meta">
          <span className="person-credit__meta-year">{year} · </span>
          {kind.filter(Boolean).join(' · ')}
        </span>
      </span>
      {t.rating !== undefined ? (
        <RatingBadge value={t.rating} size="sm" />
      ) : isUpcoming(c) ? (
        <span className="person-credit__soon">Not out yet</span>
      ) : (
        <span />
      )}
    </li>
  );
}

function Details({ p, counts }: { p: PersonDetails; counts: { films: number; series: number } }) {
  const first = firstFilm(p.credits);
  const credits = [counts.films > 0 && plural(counts.films, 'film'), counts.series > 0 && `${counts.series.toLocaleString('en-US')} series`]
    .filter(Boolean)
    .join(', ');

  return (
    <section id="details" className="title-panel title-section-anchor" aria-labelledby="details-title">
      <h2 id="details-title" className="title-panel__title">
        Details
      </h2>
      <dl className="title-details">
        {p.department && (
          <>
            <dt>Known for</dt>
            <dd>{p.department}</dd>
          </>
        )}
        {p.birthday && (
          <>
            <dt>Born</dt>
            <dd>
              {formatDate(p.birthday)}
              {!p.deathday && ` (age ${yearsBetween(p.birthday, today())})`}
            </dd>
          </>
        )}
        {p.deathday && (
          <>
            <dt>Died</dt>
            <dd>
              {formatDate(p.deathday)}
              {p.birthday && ` (aged ${yearsBetween(p.birthday, p.deathday)})`}
            </dd>
          </>
        )}
        {p.birthplace && (
          <>
            <dt>Birthplace</dt>
            <dd>{p.birthplace}</dd>
          </>
        )}
        {p.aliases.length > 0 && (
          <>
            <dt>Also known as</dt>
            <dd>{p.aliases.slice(0, 3).join(', ')}</dd>
          </>
        )}
        {credits && (
          <>
            <dt>Credits</dt>
            <dd>{credits}</dd>
          </>
        )}
        {first && (
          <>
            <dt>First film</dt>
            <dd>
              <a className="person-name" href={titleHref(first.title.id)}>
                {first.title.title}
              </a>{' '}
              ({yearOf(first.date)})
            </dd>
          </>
        )}
      </dl>
    </section>
  );
}

function HighestRated({ groups }: { groups: CreditGroup[] }) {
  const best = highestRated(groups);
  if (!best) return null;
  const { credit: c, department } = best;
  const role = roleLabel(department, c.role);

  return (
    <section className="title-panel" aria-labelledby="highest-rated">
      <h2 id="highest-rated" className="title-panel__title">
        Highest rated
      </h2>
      <div className="title-score">
        <span className="title-score__value">{c.title.rating!.toFixed(1)}</span>
        <span className="title-score__meta">
          <a className="person-best__title" href={titleHref(c.title.id)}>
            {c.title.title}
          </a>
          <span>{[yearOf(c.date), role].filter(Boolean).join(' · ')}</span>
        </span>
      </div>
    </section>
  );
}

function Elsewhere({ links }: { links: PersonDetails['links'] }) {
  const items = [
    links.imdb && { label: 'IMDb', href: links.imdb },
    links.instagram && { label: 'Instagram', href: links.instagram },
    links.homepage && { label: 'Official site', href: links.homepage },
  ].filter((x): x is { label: string; href: string } => Boolean(x));
  if (!items.length) return null;

  return (
    <section className="title-panel" aria-labelledby="elsewhere">
      <h2 id="elsewhere" className="title-panel__title">
        Elsewhere
      </h2>
      <ul className="person-links">
        {items.map((l) => (
          <li key={l.label}>
            <a className="title-link" href={l.href} target="_blank" rel="noopener noreferrer">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
