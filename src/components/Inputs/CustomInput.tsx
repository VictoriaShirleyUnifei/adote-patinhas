type CustomInputProps = {
  label?: string;
  placeholder?: string;
  type?: string;
};

export default function CustomInput({
  label,
  placeholder,
  type = "text",
 ...inputProps
}: CustomInputProps) {
  return (
    <div className="flex flex-col space-y-2">
      {label && <label className="text-white font-semibold">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        className="bg-gray-100 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
         {...inputProps}
      />
    </div>
  );
}
