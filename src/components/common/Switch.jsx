export default function Switch({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-700">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 rounded-full transition ${
          checked ? 'bg-brand-primary' : 'bg-slate-300'
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${
            checked ? 'left-4' : 'left-0.5'
          }`}
        />
      </button>
      {label}
    </label>
  );
}
