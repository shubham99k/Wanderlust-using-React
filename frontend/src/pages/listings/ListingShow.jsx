import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { api } from "../../utils/api";
import ConfirmDialog from "../../components/includes/ConfirmDialog";
import "./ListingShow.css";

const fmt = (n) => "₹ " + Number(n).toLocaleString("en-IN");
const stars = (r) => "★".repeat(r) + "☆".repeat(5 - r);
const ini = (n) => n?.[0]?.toUpperCase() ?? "?";

/* ── Star Picker ── */
function StarPicker({ value, onChange }) {
  const [hov, setHov] = useState(0);
  return (
    <div className="star-picker">
      {[1, 2, 3, 4, 5].map((v) => (
        <button
          key={v}
          type="button"
          className={`star-picker__btn ${v <= (hov || value) ? "active" : ""}`}
          onClick={() => onChange(v)}
          onMouseEnter={() => setHov(v)}
          onMouseLeave={() => setHov(0)}
        >
          ★
        </button>
      ))}
      {value > 0 && <span className="star-picker__label">{value} / 5</span>}
    </div>
  );
}

/* ── Review Form ── */
function ReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) return;
    setLoading(true);
    await onSubmit({ rating, comment });
    setRating(0);
    setComment("");
    setLoading(false);
  };

  return (
    <form className="review-form" onSubmit={handle} noValidate>
      <h4 className="review-form__title">Leave a Review</h4>
      <div className="form-group">
        <label className="form-label">Rating</label>
        <StarPicker value={rating} onChange={setRating} />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="rev-comment">
          Comment
        </label>
        <textarea
          id="rev-comment"
          className="form-textarea"
          rows={4}
          placeholder="Share your experience…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
      </div>
      <button
        className="btn btn-dark"
        type="submit"
        disabled={loading || !rating || !comment.trim()}
      >
        {loading ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}

/* ── Review Card ── */
function ReviewCard({ review, canDelete, onDelete, style }) {
  return (
    <div className="review-card anim-fade-up" style={style}>
      <div className="review-card__head">
        <div className="review-card__avatar">
          {ini(review.author?.username)}
        </div>
        <div>
          <div className="review-card__author">
            @{review.author?.username ?? "Anonymous"}
          </div>
          {review.createdAt && (
            <div className="review-card__date">
              {new Date(review.createdAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          )}
        </div>
      </div>
      <div className="review-card__stars">{stars(review.rating)}</div>
      <p className="review-card__comment">{review.comment}</p>
      {canDelete && (
        <button
          className="review-card__del"
          onClick={() => onDelete(review._id)}
        >
          Delete review
        </button>
      )}
    </div>
  );
}

/* ── Page ── */
export default function ListingShow({ listingId, onNavigate }) {
  const { currentUser, showFlash } = useApp();
  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null); // "listing" | reviewId

  useEffect(() => {
    setLoading(true);
    api
      .getListing(listingId)
      .then((data) => {
        setListing(data);
        setReviews(data.reviews || []);
      })
      .catch(() => {
        setListing(null);
      })
      .finally(() => setLoading(false));
  }, [listingId]);

  if (loading)
    return (
      <div className="loading-wrap">
        <div className="spinner" />
        <span>Loading…</span>
      </div>
    );
  if (!listing)
    return (
      <div className="empty-state">
        <p>Listing not found.</p>
      </div>
    );

  const isOwner =
    currentUser && listing.owner && currentUser._id === listing.owner._id;

  const handleDeleteListing = async () => {
    try {
      await api.deleteListing(listing._id);
      showFlash("Listing deleted.");
      onNavigate("home");
    } catch (err) {
      showFlash(err.message || "Failed to delete listing", "error");
    }
  };

  const handleAddReview = async ({ rating, comment }) => {
    try {
      const newReview = await api.createReview(listing._id, {
        review: { rating, comment },
      });
      setReviews((x) => [...x, newReview]);
      showFlash("Review added!");
    } catch (err) {
      showFlash(err.message || "Failed to add review", "error");
    }
  };

  const handleDeleteReview = async (rid) => {
    try {
      await api.deleteReview(listing._id, rid);
      setReviews((x) => x.filter((r) => r._id !== rid));
      showFlash("Review deleted.");
      setConfirm(null);
    } catch (err) {
      showFlash(err.message || "Failed to delete review", "error");
    }
  };

  return (
    <div className="show-page container-narrow anim-fade-up">
      <button
        className="btn btn-ghost btn-sm show-page__back"
        onClick={() => onNavigate("home")}
      >
        ← Back to listings
      </button>

      {/* Title */}
      <h1 className="show-page__title">{listing.title}</h1>
      <div className="show-page__meta">
        <span>📍 {listing.location}</span>
        <span className="show-page__dot" />
        <span>{listing.country}</span>
        <span className="show-page__dot" />
        <span>
          {reviews.length} review{reviews.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Image */}
      {listing.image?.url ? (
        <img
          src={listing.image.url}
          alt={listing.title}
          className="show-page__img"
        />
      ) : (
        <div className="show-page__img-placeholder">🏠</div>
      )}

      {/* Price banner */}
      <div className="show-page__price-banner">
        <div>
          <div className="show-page__price-label">Price per night</div>
          <div className="show-page__price-val">{fmt(listing.price)}</div>
          <div className="show-page__price-note">Taxes & fees may apply</div>
        </div>
        <span className="show-page__price-moon">🌙</span>
      </div>

      {/* Info grid */}
      <div className="show-page__info-grid">
        <div className="show-page__info-card">
          <div className="show-page__info-label">Location</div>
          <div className="show-page__info-val">📍 {listing.location}</div>
        </div>
        <div className="show-page__info-card">
          <div className="show-page__info-label">Country</div>
          <div className="show-page__info-val">🌐 {listing.country}</div>
        </div>
      </div>

      {/* Description */}
      {listing.description && (
        <p className="show-page__desc">{listing.description}</p>
      )}

      {/* Owner */}
      {listing.owner && (
        <div className="show-page__owner">
          <div className="show-page__owner-avatar">
            {ini(listing.owner.username)}
          </div>
          <div>
            <div className="show-page__owner-label">Hosted by:</div>
            <div className="show-page__owner-name">
              @{listing.owner.username}
            </div>
          </div>
          <br />
          <div>
            <div className="show-page__owner-label">Contact Email:</div>
            <div className="show-page__owner-name">{listing.owner.email}</div>
          </div>
        </div>
      )}

      {/* Owner actions */}
      {isOwner && (
        <div className="show-page__actions">
          <button
            className="btn btn-dark"
            onClick={() => onNavigate("edit", listing._id)}
          >
            ✏️ Edit
          </button>
          <button
            className="btn btn-danger"
            onClick={() => setConfirm("listing")}
          >
            🗑️ Delete
          </button>
        </div>
      )}

      <hr className="divider" />

      {/* Reviews */}
      <h3 className="show-page__reviews-title">
        Reviews{" "}
        <span className="show-page__reviews-count">({reviews.length})</span>
      </h3>

      {currentUser ? (
        <ReviewForm onSubmit={handleAddReview} />
      ) : (
        <div className="login-to-review">
          <p>
            <button
              className="btn btn-dark"
              onClick={() => onNavigate("login")}
            >
              Login to add a review
            </button>
          </p>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="empty-state" style={{ padding: "32px 0" }}>
          <div className="empty-state__icon">💬</div>
          <p className="empty-state__text">No reviews yet — be the first!</p>
        </div>
      ) : (
        <div className="show-page__review-grid">
          {reviews.map((r, i) => (
            <ReviewCard
              key={r._id}
              review={r}
              canDelete={currentUser?.username === r.author?.username}
              onDelete={(id) => setConfirm(id)}
              style={{ animationDelay: `${i * 0.07}s` }}
            />
          ))}
        </div>
      )}

      {/* Confirm dialogs */}
      {confirm === "listing" && (
        <ConfirmDialog
          title="Delete this listing?"
          sub="This action cannot be undone. The listing and all its reviews will be permanently removed."
          onConfirm={handleDeleteListing}
          onCancel={() => setConfirm(null)}
        />
      )}
      {confirm && confirm !== "listing" && (
        <ConfirmDialog
          title="Delete this review?"
          sub="Are you sure you want to remove your review?"
          onConfirm={() => handleDeleteReview(confirm)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
