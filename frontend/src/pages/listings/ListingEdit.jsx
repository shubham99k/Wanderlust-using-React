import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { api } from "../../utils/api";
import "./ListingForm.css";

export default function ListingEdit({ listingId, onNavigate }) {
  const { showFlash } = useApp();
  const [form, setForm] = useState(null);
  const [imgFile, setImgFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    api
      .getListing(listingId)
      .then((l) => {
        setForm({
          title: l.title || "",
          description: l.description || "",
          price: String(l.price || ""),
          location: l.location || "",
          country: l.country || "",
          imageUrl: l.image?.url || "",
        });
        setFetching(false);
      })
      .catch(() => {
        showFlash("Failed to load listing", "error");
        onNavigate("home");
      });
  }, [listingId]);

  if (fetching || !form)
    return (
      <div className="loading-wrap">
        <div className="spinner" />
        <span>Loading…</span>
      </div>
    );

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setImgFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.price || +form.price <= 0) e.price = "Enter a valid price";
    if (!form.location.trim()) e.location = "Location is required";
    if (!form.country.trim()) e.country = "Country is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    const fd = new FormData();
    fd.append("listing[title]", form.title);
    fd.append("listing[description]", form.description);
    fd.append("listing[price]", form.price);
    fd.append("listing[location]", form.location);
    fd.append("listing[country]", form.country);
    if (imgFile) fd.append("listing[image]", imgFile);
    try {
      await api.updateListing(listingId, fd);
      showFlash("Listing updated!");
      onNavigate("show", listingId);
    } catch (err) {
      showFlash(err.message || "Failed to update listing", "error");
    } finally {
      setLoading(false);
    }
  };

  const imgSrc = preview || form.imageUrl;

  return (
    <div className="lform-page container-form anim-fade-up">
      <button
        className="btn btn-ghost btn-sm lform-page__back"
        onClick={() => onNavigate("show", listingId)}
      >
        ← Back to listing
      </button>
      <h1 className="lform-page__title">Edit Listing</h1>
      <p className="lform-page__sub">Update your property details below.</p>

      <form className="lform-card" onSubmit={handleSubmit} noValidate>
        <div className="lform-section">Basic Information</div>

        <div className="form-group">
          <label className="form-label" htmlFor="le-title">
            Title *
          </label>
          <input
            id="le-title"
            className="form-input"
            value={form.title}
            onChange={set("title")}
          />
          {errors.title && <p className="form-error">{errors.title}</p>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="le-desc">
            Description
          </label>
          <textarea
            id="le-desc"
            className="form-textarea"
            value={form.description}
            onChange={set("description")}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="le-price">
            Price per night (₹) *
          </label>
          <input
            id="le-price"
            className="form-input"
            type="number"
            min="1"
            value={form.price}
            onChange={set("price")}
          />
          {errors.price && <p className="form-error">{errors.price}</p>}
        </div>

        <div className="lform-section" style={{ marginTop: 28 }}>
          Location
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="le-loc">
              City / Location *
            </label>
            <input
              id="le-loc"
              className="form-input"
              value={form.location}
              onChange={set("location")}
            />
            {errors.location && <p className="form-error">{errors.location}</p>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="le-country">
              Country *
            </label>
            <input
              id="le-country"
              className="form-input"
              value={form.country}
              onChange={set("country")}
            />
            {errors.country && <p className="form-error">{errors.country}</p>}
          </div>
        </div>

        <div className="lform-section" style={{ marginTop: 28 }}>
          Photo
        </div>
        <div className="form-group">
          <label className="lform-filedrop" htmlFor="le-file">
            <input
              id="le-file"
              type="file"
              accept="image/*"
              onChange={handleFile}
              style={{ display: "none" }}
            />
            <span className="lform-filedrop__icon">🖼️</span>
            <span className="lform-filedrop__text">
              <strong>Click to replace image</strong> or drag & drop
            </span>
            <span className="lform-filedrop__hint">
              PNG · JPG · WEBP up to 10 MB
            </span>
          </label>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="le-url">
            Or paste an image URL
          </label>
          <input
            id="le-url"
            className="form-input"
            value={form.imageUrl}
            onChange={set("imageUrl")}
          />
        </div>

        {imgSrc && (
          <div className="lform-preview">
            <img src={imgSrc} alt="preview" />
          </div>
        )}

        <button
          className="btn btn-primary btn-full"
          type="submit"
          disabled={loading}
          style={{ marginTop: 8 }}
        >
          {loading ? "Saving…" : "✓ Save Changes"}
        </button>
      </form>
    </div>
  );
}
