interface FormFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  as?: "input" | "textarea" | "select";
  options?: { value: string | number; label: string }[];
  min?: number;
  step?: string;
}

const baseClass = "w-full h-10 px-3 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors duration-200";

const FormFieldComponent = ({ label, name, value, onChange, type = "text", required, placeholder, as = "input", options, min, step }: FormFieldProps) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-foreground">{label}{required && <span className="text-destructive ml-0.5">*</span>}</label>
    {as === "textarea" ? (
      <textarea name={name} value={value} onChange={onChange} required={required} placeholder={placeholder} rows={3} className={`${baseClass} h-auto py-2`} />
    ) : as === "select" ? (
      <select name={name} value={value} onChange={onChange} required={required} className={baseClass}>
        <option value="">Select...</option>
        {options?.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    ) : (
      <input type={type} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder} min={min} step={step} className={baseClass} />
    )}
  </div>
);

export default FormFieldComponent;
