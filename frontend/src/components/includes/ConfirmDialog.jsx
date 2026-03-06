import "./ConfirmDialog.css";

export default function ConfirmDialog({
  icon = "🗑️",
  title,
  sub,
  confirmLabel = "Delete",
  confirmClass = "btn-delete-confirm",
  onConfirm,
  onCancel,
}) {
  return (
    <div className="overlay" onClick={onCancel}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog__icon">{icon}</div>
        <div className="dialog__title">{title}</div>
        <div className="dialog__sub">{sub}</div>
        <div className="dialog__actions">
          <button className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
          <button className={`btn ${confirmClass}`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
