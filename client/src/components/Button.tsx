import React from 'react'
import { Button } from './ui/button'

interface ButtonFieldProps {
  children?: string,
  className?: string;
  icon?: JSX.Element;
  type?: "button" | "submit" | "reset";
  variant?: "default" | "outline" | "ghost" | "link" | "destructive";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onChange?: React.ChangeEventHandler<HTMLButtonElement>;
}

function ButtonField(
   { children, className, variant, icon, type, onClick, onChange }: ButtonFieldProps
) {
  return (
   <Button type={type} variant={variant} className={className} onClick={onClick && onClick} onChange={onChange && onChange}>
    {icon && icon}
    {children}
   </Button>
  )
}

export default ButtonField;
