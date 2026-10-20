import { Fragment, useEffect, useState } from 'react';
import { CastStrip, Hero, PosterRow, RatingBadge, RatingInput, Tabs } from 'reelscore';
import { catalog, type Person, type Review, type TitleDetails } from '../api';
import { focalPointFor } from '../data/focalPoints';
import { TitleCard } from '../components/TitleRow';
import { useAsync } from '../hooks/useAsync';
import type { LibraryApi } from '../hooks/useLibrary';
import { personHref } from '../router';
import { formatDate, initials, shorten } from '../text';

const REVIEW_LENGTH = 420;

interface TitlePageProps {
  id: string;
  library: LibraryApi;
}

export function TitlePage({ id, library }: TitlePageProps) {
  const [state, retry] = useAsync((signal) => catalog.getTitle(id, signal), [id]);

  const name = state.status === 'ready' ? state.data.title : undefined;
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
      <section className="row-status title-error" aria-label="Title">
        <h1 className="row-status__title">This title didn&rsquo;t load</h1>
        <p>Check your connection and try again.</p>
        <button type="button" className="row-status__retry" onClick={retry}>
          Try again
        </button>
      </section>
    );
  }

  return <TitleView t={state.data} library={library} />;
}

function TitleView({ t, library }: { t: TitleDetails; library: LibraryApi }) {
  const [section, setSection] = useState('overview');

  // Tabs jump to sections; only offer the ones this title has.
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'reviews', label: 'Reviews' },
    t.cast.length > 0 && { id: 'cast', label: 'Cast & crew' },
    { id: 'details', label: 'Details' },
    t.similar.length > 0 && { id: 'similar', label: 'More like this' },
  ].filter((x): x is { id: string; label: string } => Boolean(x));

  function jumpTo(sectionId: string) {
    setSection(sectionId);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(sectionId)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }

  return (
    <>
      <Hero
        title={t.title}
        image={t.backdropUrl}
        focalPoint={focalPointFor(t.id)}
        ageRating={t.ageRating}
        rating={t.rating}
        year={t.year}
        length={t.length}
        synopsis={shorten(t.synopsis, 160)}
        watchLabel="Watch trailer"
        onWatch={t.trailerUrl ? () => window.open(t.trailerUrl, '_blank', 'noopener') : undefined}
      >
        <Tabs
          label="Title sections"
          overlay
          items={tabs.map((tab) => ({ ...tab, panelId: tab.id }))}
          value={section}
          onChange={jumpTo}
        />
      </Hero>

      <div className="title-body">
        <div className="title-main">
          <Overview t={t} />
          {t.cast.length > 0 && <Cast title={t.title} cast={t.cast} />}
          <Reviews reviews={t.reviews} />
        </div>

        <aside className="title-aside" aria-label="Ratings">
          <section className="title-panel" aria-labelledby="your-rating">
            <h2 id="your-rating" className="title-panel__title">
              Your rating
            </h2>
            <RatingInput
              label={`Your rating for ${t.title}`}
              value={library.ratingOf(t.id)}
              onChange={(score) => library.rate(t.id, score)}
            />
          </section>

          <CommunityScore t={t} />
          <Details t={t} />
        </aside>
      </div>

      {t.similar.length > 0 && (
        <div id="similar" className="title-section-anchor">
          <PosterRow title="More like this">
            {t.similar.map((s) => (
              <TitleCard key={s.id} title={s} library={library} />
            ))}
          </PosterRow>
        </div>
      )}
    </>
  );
}

/** Names, comma separated, each linking to that person's page. */
function Names({ people }: { people: Person[] }) {
  return (
    <>
      {people.map((p, i) => (
        <Fragment key={`${p.id}-${i}`}>
          {i > 0 && ', '}
          <a className="person-name" href={personHref(p.id)}>
            {p.name}
          </a>
        </Fragment>
      ))}
    </>
  );
}

function Overview({ t }: { t: TitleDetails }) {
  const starring = t.cast.slice(0, 3);
  return (
    <section id="overview" className="title-section" aria-labelledby="overview-title">
      <h2 id="overview-title" className="title-section__title">
        Overview
      </h2>
      {t.genres.length > 0 && (
        <ul className="title-genres" aria-label="Genres">
          {t.genres.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      )}
      {t.synopsis && <p className="title-overview">{t.synopsis}</p>}
      {(t.creators.length > 0 || t.directors.length > 0 || t.writers.length > 0 || starring.length > 0) && (
        <dl className="title-credits">
          {t.creators.length > 0 && (
            <>
              <dt>Created by</dt>
              <dd>
                <Names people={t.creators} />
              </dd>
            </>
          )}
          {t.directors.length > 0 && (
            <>
              <dt>{t.directors.length > 1 ? 'Directors' : 'Director'}</dt>
              <dd>
                <Names people={t.directors} />
              </dd>
            </>
          )}
          {t.writers.length > 0 && (
            <>
              <dt>{t.writers.length > 1 ? 'Writers' : 'Writer'}</dt>
              <dd>
                <Names people={t.writers.slice(0, 4)} />
              </dd>
            </>
          )}
          {starring.length > 0 && (
            <>
              <dt>Starring</dt>
              <dd>
                <Names people={starring} />
              </dd>
            </>
          )}
        </dl>
      )}
    </section>
  );
}

function Cast({ title, cast }: { title: string; cast: Person[] }) {
  return (
    <section id="cast" className="title-section" aria-labelledby="cast-title">
      <h2 id="cast-title" className="title-section__title">
        Cast
      </h2>
      <CastStrip
        title={title}
        people={cast.map((p, i) => ({ id: `${p.id}-${i}`, name: p.name, role: p.role, photo: p.photoUrl, href: personHref(p.id) }))}
      />
    </section>
  );
}

function Reviews({ reviews }: { reviews: TitleDetails['reviews'] }) {
  return (
    <section id="reviews" className="title-section" aria-labelledby="reviews-title">
      <h2 id="reviews-title" className="title-section__title">
        Reviews
        {reviews.total > 0 && <span className="title-section__count"> &middot; {reviews.total.toLocaleString('en-US')}</span>}
      </h2>
      {reviews.items.length === 0 ? (
        <p className="title-empty">No one has reviewed this yet.</p>
      ) : (
        reviews.items.map((r) => <ReviewCard key={r.id} review={r} />)
      )}
    </section>
  );
}

function ReviewCard({ review: r }: { review: Review }) {
  const text = shorten(r.text, REVIEW_LENGTH)!;
  return (
    <article className="title-review">
      <header className="title-review__head">
        <span className="title-review__avatar" aria-hidden="true">
          {initials(r.author)}
        </span>
        <div className="title-review__who">
          <span className="title-review__name">{r.author}</span>
          <span className="title-review__date">
            {r.rating ? 'Rated' : 'Reviewed'} {formatDate(r.date, 'short')}
          </span>
        </div>
        {r.rating !== undefined && <RatingBadge value={r.rating} size="md" />}
      </header>
      <p className="title-review__text">{text}</p>
      {text !== r.text && r.url && (
        <a className="title-link" href={r.url} target="_blank" rel="noopener noreferrer">
          Read the full review
        </a>
      )}
    </article>
  );
}

function CommunityScore({ t }: { t: TitleDetails }) {
  return (
    <section className="title-panel" aria-labelledby="community-score">
      <h2 id="community-score" className="title-panel__title">
        Community score
      </h2>
      {t.rating !== undefined ? (
        <div className="title-score">
          <span className="title-score__value">{t.rating.toFixed(1)}</span>
          <span className="title-score__meta">
            <span>out of 10</span>
            {t.voteCount !== undefined && <span>{t.voteCount.toLocaleString('en-US')} ratings</span>}
          </span>
        </div>
      ) : (
        <p className="title-empty">Not enough ratings yet.</p>
      )}
    </section>
  );
}

function Details({ t }: { t: TitleDetails }) {
  const w = t.watch;
  return (
    <section id="details" className="title-panel title-section-anchor" aria-labelledby="details-title">
      <h2 id="details-title" className="title-panel__title">
        Details
      </h2>
      <dl className="title-details">
        {t.releaseDate && (
          <>
            <dt>{t.kind === 'series' ? 'First aired' : 'Released'}</dt>
            <dd>{formatDate(t.releaseDate)}</dd>
          </>
        )}
        {t.length && (
          <>
            <dt>{t.kind === 'series' ? 'Length' : 'Runtime'}</dt>
            <dd>{t.length}</dd>
          </>
        )}
        {t.languages.length > 0 && (
          <>
            <dt>{t.languages.length > 1 ? 'Languages' : 'Language'}</dt>
            <dd>{t.languages.join(', ')}</dd>
          </>
        )}
        <dt>Where to watch</dt>
        <dd>
          {w?.stream.length ? w.stream.join(', ') : w?.rentOrBuy ? 'Rent or buy' : 'Not streaming in the US yet'}
          {w?.link && (w.stream.length > 0 || w.rentOrBuy) && (
            <>
              {' '}
              <a className="title-link" href={w.link} target="_blank" rel="noopener noreferrer">
                All options
              </a>
            </>
          )}
        </dd>
      </dl>
      {/* TMDB's terms require crediting JustWatch wherever its watch-provider data appears. */}
      {w && <p className="title-attribution">Streaming data from JustWatch</p>}
    </section>
  );
}
