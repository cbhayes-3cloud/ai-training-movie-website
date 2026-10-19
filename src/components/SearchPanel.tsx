import type { PersonMatch, Title } from '../api';
import type { SearchState } from '../hooks/useSearch';
import { personHref, titleHref } from '../router';
import { initials } from '../text';

const KIND_LABEL: Record<Title['kind'], string> = { movie: 'Film', series: 'Series' };

function TitleResult({ title: t }: { title: Title }) {
  const meta = [KIND_LABEL[t.kind], t.year, t.genres[0]].filter(Boolean).join(' · ');
  return (
    <a className="search-result" href={titleHref(t.id)}>
      {t.posterUrl ? (
        <img className="search-result__thumb" src={t.posterUrl} alt="" loading="lazy" />
      ) : (
        <span className="search-result__thumb" aria-hidden="true" />
      )}
      <span className="search-result__text">
        <span className="search-result__name">{t.title}</span>
        <span className="search-result__meta">{meta}</span>
      </span>
      {t.rating !== undefined && (
        <span className="search-result__score" aria-label={`Rated ${t.rating.toFixed(1)} out of 10`}>
          ★ {t.rating.toFixed(1)}
        </span>
      )}
    </a>
  );
}

/** A person links to their person page. */
function PersonResult({ person: p }: { person: PersonMatch }) {
  const known = p.knownFor.slice(0, 2).map((t) => t.title).join(', ');
  const meta = [p.department, known && `Known for ${known}`].filter(Boolean).join(' · ');
  return (
    <a className="search-result" href={personHref(p.id)}>
      {p.photoUrl ? (
        <img className="search-result__thumb search-result__thumb--person" src={p.photoUrl} alt="" loading="lazy" />
      ) : (
        <span className="search-result__thumb search-result__thumb--person" aria-hidden="true">
          {initials(p.name)}
        </span>
      )}
      <span className="search-result__text">
        <span className="search-result__name">{p.name}</span>
        {meta && <span className="search-result__meta">{meta}</span>}
      </span>
    </a>
  );
}

/** What shows under the NavBar's search field: films and series, then people. */
export function SearchPanel({ state }: { state: SearchState }) {
  const { results, error, pending, query } = state;

  if (!results && !error) return <p className="search-status" role="status">Searching…</p>;
  if (error && !pending) return <p className="search-status" role="status">Search isn't working right now. Try again in a moment.</p>;
  if (results && !results.titles.length && !results.people.length) {
    return (
      <p className="search-status" role="status">
        {pending ? 'Searching…' : `No films, series or people match “${query}”.`}
      </p>
    );
  }

  return (
    <div className={pending ? 'search-results is-pending' : 'search-results'} aria-busy={pending}>
      {!!results?.titles.length && (
        <section aria-label="Films and series">
          <h2 className="search-results__label">Films &amp; series</h2>
          {results.titles.map((t) => (
            <TitleResult key={t.id} title={t} />
          ))}
        </section>
      )}
      {!!results?.people.length && (
        <section aria-label="People">
          <h2 className="search-results__label">People</h2>
          {results.people.map((p) => (
            <PersonResult key={p.id} person={p} />
          ))}
        </section>
      )}
    </div>
  );
}
