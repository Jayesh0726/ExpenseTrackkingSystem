import { Input } from "./ui/input"
import { Label } from "./ui/label"
import React,  {useId} from "react"


interface InputFieldProps {
  label?: string;
  className?: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(function InputField({
  label = "",
  type = "text",
  className = "",
  placeholder = "",
  ...props
}, ref) {
  const id = useId()
  return (
    <div className="grid w-full max-w-sm items-center gap-3">
      {label && <Label htmlFor={id}>{label}</Label>}
      <Input type={type} id={id} placeholder={placeholder} className={`${className}`} {...props} ref={ref} />
    </div>
  )
})

InputField.displayName = "InputField"
export default InputField;

