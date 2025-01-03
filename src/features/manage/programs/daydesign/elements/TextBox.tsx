import { HTMLProps, forwardRef } from "react";
import cx from "classnames";

export const TextBox = forwardRef<
  HTMLInputElement,
  HTMLProps<HTMLInputElement>
>((props, ref) => (
  <input
    ref={ref}
    placeholder='Enter value'
    {...props}
    className={cx(
      "w-full rounded-sm border-2 border-[#C9DAD7] bg-transparent p-2",
      props.className
    )}
  />
));
