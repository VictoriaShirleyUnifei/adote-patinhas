import { ArrowDropDown } from "@mui/icons-material";

type CustomSelectProps = {
  label?: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  color?: string;
  labelColor?: string;
  backgroundColor?: string;
  borderColor?: string;
};

export default function CustomSelect({
  label,
  options,
  value,
  onChange,
  color,
  labelColor = "white",
  backgroundColor,
  borderColor,
  ...selectProps
}: CustomSelectProps) {
  return (
    <div className="flex flex-col space-y-2">
      {label && (
        <label style={{ color: labelColor }} className="font-medium">
          {label}
        </label>
      )}
      
      {/* Wrapper com ícone personalizado */}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          style={{
            color: color,
            backgroundColor: backgroundColor,
            borderColor: borderColor,
          }}
          className="w-full border rounded-lg py-2 px-4 focus:outline-none appearance-none pr-10" // pr-10 para espaço do ícone
          {...selectProps}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        
        {/* Ícone personalizado */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ArrowDropDown 
            className="w-5 h-5"
          />
        </div>
      </div>
    </div>
  );
}