import type { IEmployee } from "@/utils/employee";

type InputFieldProps = {
  label: string;
  name: keyof IEmployee;
  type?: "text" | "email" | "date";
  value?: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  error?: string;
  placeholder?: string;
  options?: string[];
};

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  options,
}: InputFieldProps) => (
  <div>
    <label className="block mb-1 font-medium text-gray-700">{label}</label>
    {options ? (
      <div className="flex gap-6">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2">
            <input
              type="radio"
              name={name}
              value={opt}
              checked={value === opt}
              onChange={onChange}
              className={opt === "Male" ? "accent-blue-500" : "accent-pink-500"}
            />
            {opt}
          </label>
        ))}
      </div>
    ) : (
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />
    )}
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default InputField;
