import cx from "classnames";
import { ParamVoidCallback } from "utils";

export function AnswerOption({
  globalPrefix = "",
  value,
  qid,
  aid,
  multiple,
  className,
  checked,
  defaultChecked,
  onChange = () => {},
  title,
}: {
  globalPrefix: string;
  qid: any;
  aid: any;
  value?: string;
  multiple?: boolean;
  className?: string;

  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: ParamVoidCallback<boolean>;

  title?: string;
}) {
  let id = `${globalPrefix}-${qid}-answer-${aid}`;
  return (
    <div title={title} className={cx("flex items-center", className)}>
      <input
        onChange={event => {
          onChange(event.target.checked);
        }}
        type={multiple ? "checkbox" : "radio"}
        name={globalPrefix + "-answer-" + qid}
        id={id}
        className='peer h-0 w-0 appearance-none opacity-0'
        {...(checked === undefined ? {} : { checked: !!checked })}
        defaultChecked={defaultChecked}
      />
      <label
        htmlFor={id}
        className={cx(
          "inline-block h-5 w-5 border border-[#707070] text-center peer-checked:border-0 peer-checked:bg-[#9FBC69]",
          multiple ? "rounded-sm" : "rounded-full",
          "cursor-pointer"
        )}
      />
      {value && (
        <label htmlFor={id} className='ml-3 flex-1'>
          {value}
        </label>
      )}
    </div>
  );
}
