import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { api } from "../../utils/api";
import ListingCard from "../../components/includes/ListingCard";
import "./ListingIndex.css";
import "../../context/ColdStartBanner.css";

export default function ListingIndex({ onNavigate, onSelectListing }) {
  const { currentUser } = useApp();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showColdMsg, setShowColdMsg] = useState(false);

  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setShowColdMsg(true), 5000);
    return () => clearTimeout(t);
  }, [loading]);

  useEffect(() => {
    api
      .getListings()
      .then((data) => setListings(data))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = listings.filter((l) =>
    [l.title, l.location, l.country]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <>
      {/* ── HERO ── */}
      <section className="idx-hero">
        <div className="idx-hero__content anim-fade-up">
          <span className="idx-hero__eyebrow">✦ Discover unique stays</span>
          <h1 className="idx-hero__title">
            Find your next
            <br />
            <em>perfect escape</em>
          </h1>
          <p className="idx-hero__sub">
            From mountain retreats to city lofts — every stay tells a story.
          </p>

          <div className="idx-hero__searchbar">
            <span className="idx-hero__search-icon">🔍</span>
            <input
              className="idx-hero__search-input"
              placeholder="Search by city, country or name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                className="idx-hero__search-clear"
                onClick={() => setSearch("")}
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div className="idx-hero__visual" aria-hidden>
          <div className="idx-hero__v-card idx-hero__v-card--1">
            <div className="idx-hero__v-card-img">🏔️</div>
            <div className="idx-hero__v-card-body">
              <div className="idx-hero__v-card-title">Mountain Retreat</div>
              <div className="idx-hero__v-card-loc">📍 Manali, India</div>
            </div>
          </div>
          <div className="idx-hero__v-card idx-hero__v-card--2">
            <div className="idx-hero__v-card-img">🏖️</div>
            <div className="idx-hero__v-card-body">
              <div className="idx-hero__v-card-title">Beach Villa</div>
              <div className="idx-hero__v-card-loc">📍 Goa, India</div>
            </div>
          </div>
          <div className="idx-hero__v-card idx-hero__v-card--3">
            <div className="idx-hero__v-card-img">🏙️</div>
            <div className="idx-hero__v-card-body">
              <div className="idx-hero__v-card-title">City Loft</div>
              <div className="idx-hero__v-card-loc">📍 Mumbai, India</div>
            </div>
          </div>
          <div className="idx-hero__v-float">
            <span>🌍</span>
            <div>
              <div className="idx-hero__v-num">{listings.length}+</div>
              <div className="idx-hero__v-label">Unique stays</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GRID ── */}
      <section className="idx-listings">
        <div className="container">
          <div className="idx-listings__header">
            <h2 className="idx-listings__title">All Listings</h2>
            <span className="idx-listings__count">
              {loading
                ? "Loading…"
                : `${filtered.length} place${filtered.length !== 1 ? "s" : ""}`}
            </span>
          </div>

          {loading ? (
            <div className="loading-wrap">
              <div className="spinner" />
              <span>Loading listings…</span>
              {showColdMsg && (
                <div
                  className="cold-start-banner anim-fade-in"
                  style={{ marginTop: "1rem" }}
                >
                  <span className="cold-start-banner__icon">ℹ️</span>
                  <p>
                    Our backend is hosted on Render's free tier and sleeps after
                    inactivity. It's waking up now — this may take
                    <strong> 40–60 seconds</strong>. Thanks for your patience!
                  </p>
                </div>
              )}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">🔍</div>
              <p className="empty-state__text">
                No listings found for "{search}"
              </p>
              <button className="btn btn-outline" onClick={() => setSearch("")}>
                Clear search
              </button>
            </div>
          ) : (
            <div className="idx-grid">
              {filtered.map((l, i) => (
                <ListingCard
                  key={l._id}
                  listing={l}
                  onClick={onSelectListing}
                  style={{ animationDelay: `${i * 0.05}s` }}
                />
              ))}
              {currentUser && (
                <button
                  className="idx-grid__add"
                  onClick={() => onNavigate("new")}
                >
                  <span className="idx-grid__add-icon">＋</span>
                  <span className="idx-grid__add-label">List your space</span>
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
