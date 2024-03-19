import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  type: "text" | "date" | "number" | "file";
  label: string;
}

function Input({ placeholder, type, label, ...rest }: InputProps) {
  return (
    <div className="flex flex-col space-y-1 w-full md:px-4">
      <label htmlFor="matricula">{label}</label>
      <input
        type={type}
        name="matricula"
        className="w-full border-b-2 border-transparent focus-visible:border-[#edf100] outline-none bg-zinc-700/30 px-2 text-zinc-50 py-2 rounded-md"
        placeholder={placeholder}
        {...rest}
      />
    </div>
  );
}

export default Input;
