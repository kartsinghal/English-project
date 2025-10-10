import * as React from "react";

interface RadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function RadioGroup({
  value,
  onValueChange,
  children,
  className = "",
}: RadioGroupProps) {
  const [selected, setSelected] = React.useState(value || "");

  const handleChange = (val: string) => {
    setSelected(val);
    onValueChange?.(val);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;

        // We tell TS that this child is a ReactElement with specific props
        const typedChild = child as React.ReactElement<{
          value: string;
          checked?: boolean;
          onChange?: () => void;
        }>;

        const isSelected = typedChild.props.value === selected;

        return React.cloneElement(typedChild, {
          checked: isSelected,
          onChange: () => handleChange(typedChild.props.value),
        });
      })}
    </div>
  );
}

interface RadioGroupItemProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function RadioGroupItem({
  value,
  label,
  checked,
  onChange,
  className = "",
}: RadioGroupItemProps) {
  return (
    <label
      className={`flex items-center gap-2 cursor-pointer rounded-lg border border-gray-200 p-2 hover:bg-gray-50 transition ${className}`}
    >
      <input
        type="radio"
        name="radio-group"
        value={value}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-blue-500"
      />
      <span>{label || value}</span>
    </label>
  );
}
