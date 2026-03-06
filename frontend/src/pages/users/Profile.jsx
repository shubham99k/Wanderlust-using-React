import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { api } from "../../utils/api";
import ListingCard from "../../components/includes/ListingCard";
import "./Profile.css";

const stars = (r) => "\u2605".repeat(r) + "\u2606".repeat(5 - r);
const ini = (n) => n?.[0]?.toUpperCase() ?? "?";

export default function Profile({ onNavigate }) {
  const { currentUser } = useApp();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getProfile()
      .then((res) => setData(res))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="loading-wrap">
        <div className="spinner" />
        <span>Loading profile...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="empty-state">
        <p>Could not load profile.</p>
      </div>
    );
  }

  const { user, listings, reviews, stats } = data;

  return (
    <div className="profile container-narrow anim-fade-up">
      <button
        className="btn btn-ghost btn-sm"
        style={{ marginBottom: 24 }}
        onClick={() => onNavigate("home")}
      >
        &larr; Back to listings
      </button>

      {/* Header */}
      <div className="profile__header">
        <div className="profile__avatar">{ini(user.username)}</div>
        <div className="profile__info">
          <h1 className="profile__username">{user.username}</h1>
          <p className="profile__email">{user.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="profile__stats">
        <div className="profile__stat-card">
          <div className="profile__stat-num">{stats.listingCount}</div>
          <div className="profile__stat-label">Listings Posted</div>
        </div>
        <div className="profile__stat-card">
          <div className="profile__stat-num">{stats.reviewCount}</div>
          <div className="profile__stat-label">Reviews Written</div>
        </div>
      </div>

      <hr className="divider" />

      {/* Listings Section */}
      <h2 className="profile__section-title">
        My Listings{" "}
        <span className="profile__section-count">({stats.listingCount})</span>
      </h2>

      {listings.length === 0 ? (
        <div className="empty-state" style={{ padding: "32px 0" }}>
          <div className="empty-state__icon">&#127968;</div>
          <p className="empty-state__text">
            You have not posted any listings yet.
          </p>
          <button className="btn btn-dark" onClick={() => onNavigate("new")}>
            + Create your first listing
          </button>
        </div>
      ) : (
        <div className="profile__listings-grid">
          {listings.map((l, i) => (
            <ListingCard
              key={l._id}
              listing={l}
              onClick={(id) => onNavigate("show", id)}
              style={{ animationDelay: `${i * 0.05}s` }}
            />
          ))}
        </div>
      )}

      <hr className="divider" />

      {/* Reviews Section */}
      <h2 className="profile__section-title">
        My Reviews{" "}
        <span className="profile__section-count">({stats.reviewCount})</span>
      </h2>

      {reviews.length === 0 ? (
        <div className="empty-state" style={{ padding: "32px 0" }}>
          <div className="empty-state__icon">&#128172;</div>
          <p className="empty-state__text">
            You have not written any reviews yet.
          </p>
          <button className="btn btn-dark" onClick={() => onNavigate("home")}>
            Explore listings
          </button>
        </div>
      ) : (
        <div className="profile__reviews-list">
          {reviews.map((r, i) => (
            <div
              key={r._id}
              className="profile__review-card anim-fade-up"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className="profile__review-meta">
                <span className="profile__review-stars">{stars(r.rating)}</span>
                {r.createdAt && (
                  <span className="profile__review-date">
                    {new Date(r.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>
              {r.listing && (
                <button
                  className="profile__review-listing"
                  onClick={() => onNavigate("show", r.listing._id)}
                >
                  {r.listing.title}
                </button>
              )}
              <p className="profile__review-comment">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
