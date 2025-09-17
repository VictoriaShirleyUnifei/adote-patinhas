type CustomInputProps = {
  label?: string;
  placeholder?: string;
  type?: string;
  color?: string;
  labelColor?: string;
  backgroundColor?: string;
  borderColor?: string;
};

export default function CustomInput({
  label,
  placeholder,
  type = "text",
  color,
  labelColor = "white",
  backgroundColor,
  borderColor,
  ...inputProps
}: CustomInputProps) {
  return (
    <div className="flex flex-col space-y-2">
     {label && (
        <label style={{ color: labelColor }} className="font-medium">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        style={{
          color: color,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
        }}
        className="border rounded-lg px-3 py-2 focus:outline-none"
        {...inputProps}
      />
    </div>
  );
}
