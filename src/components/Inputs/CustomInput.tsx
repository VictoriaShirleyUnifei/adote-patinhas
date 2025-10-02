import React, { forwardRef, InputHTMLAttributes  } from "react";

type CustomInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  placeholder?: string;
  type?: string;
  color?: string;
  labelColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  style?: React.CSSProperties;
  multiline?: boolean;
};

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      label,
      placeholder,
      type = "text",
      color = "black",
      labelColor = "white",
      backgroundColor,
      borderColor,
      style,
      multiline = false,
      ...inputProps
    },
    ref
  ) => {
    return (
      <div className="flex flex-col space-y-2">
        {label && (
          <label style={{ color: labelColor }} className="font-medium">
            {label}
          </label>
        )}
        {multiline ? (
          <textarea
            placeholder={placeholder}
            style={{
              width: "100%",
              color,
              backgroundColor,
              borderColor,
              ...style,
            }}
            className="border rounded-lg px-3 py-2 focus:outline-none resize-none"
            // Only pass textarea-compatible props
            {...(inputProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            ref={ref} // ⬅️ necessário para InputMask
            type={type}
            placeholder={placeholder}
            style={{
              color,
              backgroundColor,
              borderColor,
              ...style,
            }}
            className="border rounded-lg px-3 py-2 focus:outline-none"
            // Only pass input-compatible props
            {...(inputProps as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
      </div>  
    );
  }
);

CustomInput.displayName = "CustomInput";

export default CustomInput;
