import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { api } from "../../utils/api";
import "./ListingForm.css";

export default function ListingNew({ onNavigate, onCreated }) {
  const { showFlash } = useApp();
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    country: "",
    imageUrl: "",
  });
  const [imgFile, setImgFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
      const data = await api.createListing(fd);
      showFlash("Listing published!");
      onCreated(data._id);
    } catch (err) {
      showFlash(err.message || "Failed to create listing", "error");
    } finally {
      setLoading(false);
    }
  };

  const imgSrc = preview || form.imageUrl;

  return (
    <div className="lform-page container-form anim-fade-up">
      <button
        className="btn btn-ghost btn-sm lform-page__back"
        onClick={() => onNavigate("home")}
      >
        ← Back
      </button>
      <h1 className="lform-page__title">Add a New Listing</h1>
      <p className="lform-page__sub">
        Share your space with travellers around the world.
      </p>

      <form className="lform-card" onSubmit={handleSubmit} noValidate>
        <div className="lform-section">Basic Information</div>

        <div className="form-group">
          <label className="form-label" htmlFor="ln-title">
            Title *
          </label>
          <input
            id="ln-title"
            className="form-input"
            placeholder="e.g. Cozy Beachfront Cottage"
            value={form.title}
            onChange={set("title")}
          />
          {errors.title && <p className="form-error">{errors.title}</p>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="ln-desc">
            Description
          </label>
          <textarea
            id="ln-desc"
            className="form-textarea"
            placeholder="Describe what makes your space special…"
            value={form.description}
            onChange={set("description")}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="ln-price">
            Price per night (₹) *
          </label>
          <input
            id="ln-price"
            className="form-input"
            type="number"
            min="1"
            placeholder="e.g. 4500"
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
            <label className="form-label" htmlFor="ln-loc">
              City / Location *
            </label>
            <input
              id="ln-loc"
              className="form-input"
              placeholder="e.g. Manali"
              value={form.location}
              onChange={set("location")}
            />
            {errors.location && <p className="form-error">{errors.location}</p>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="ln-country">
              Country *
            </label>
            <input
              id="ln-country"
              className="form-input"
              placeholder="e.g. India"
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
          <label
            className="lform-filedrop"
            htmlFor="ln-file"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files[0];
              if (f) {
                setImgFile(f);
                setPreview(URL.createObjectURL(f));
              }
            }}
          >
            <input
              id="ln-file"
              type="file"
              accept="image/*"
              onChange={handleFile}
              style={{ display: "none" }}
            />
            <span className="lform-filedrop__icon">🖼️</span>
            <span className="lform-filedrop__text">
              <strong>Click to upload</strong> or drag & drop
            </span>
            <span className="lform-filedrop__hint">
              PNG · JPG · WEBP up to 10 MB
            </span>
          </label>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="ln-url">
            Or paste an image URL
          </label>
          <input
            id="ln-url"
            className="form-input"
            placeholder="https://images.unsplash.com/…"
            value={form.imageUrl}
            onChange={set("imageUrl")}
          />
        </div>

        {imgSrc && (
          <div className="lform-preview">
            <img src={imgSrc} alt="preview" />
            <button
              type="button"
              className="lform-preview__remove"
              onClick={() => {
                setPreview("");
                setImgFile(null);
                setForm((f) => ({ ...f, imageUrl: "" }));
              }}
            >
              × Remove
            </button>
          </div>
        )}

        <button
          className="btn btn-primary btn-full"
          type="submit"
          disabled={loading}
          style={{ marginTop: 8 }}
        >
          {loading ? "Publishing…" : "✦ Publish Listing"}
        </button>
      </form>
    </div>
  );
}
