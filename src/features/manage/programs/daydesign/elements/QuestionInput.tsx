import { HTMLProps, forwardRef } from "react";
import cx from "classnames";

export const QuestionInput = forwardRef(
  (props: HTMLProps<HTMLTextAreaElement>, ref) => (
    <textarea
      ref={ref as any}
      placeholder='Enter question'
      {...props}
      className={cx(
        "h-20 w-full rounded-sm border-2 border-[#C9DAD7] bg-transparent p-2",
        props.className
      )}
    ></textarea>
  )
);
