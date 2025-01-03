import cx from "classnames";
import { SideView } from "components/SideView/SideView";
import { Link } from "react-router-dom";
import { ParamVoidCallback, VoidCallback } from "utils";
// import React, { useState } from "react";
// import { AccordionAlwaysOpen } from "components/SideView/accordian";

function ModuleButton({
  active,
  module,
  dayIndex,
  onClicked,
  onDayClicked
}: {
  active?: boolean;
  module: any;
  dayIndex: number;
  onClicked: VoidCallback;
  onDayClicked: ParamVoidCallback<number>;
}) {
  let name = `Module ${module.serial_num}`;
  return (
    <>
      <li data-active={active} onClick={onClicked} className='module-button'>
        {name}
        <svg
          width='12'
          height='12'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
          className='rotate-90'
        >
          <path fill='currentColor' d='M0,0V24L20,12Z' />
        </svg>
      </li>
      {active && (
        <div className='max-h-[38vh] w-full space-y-1 overflow-y-scroll rounded-2xl border-[2px] border-[#81AE38] p-3'>
          {module.days.map((_, index) => (
            <button
              onClick={() => onDayClicked(index)}
              className={cx(
                "block w-full cursor-pointer rounded-md px-2 py-1 text-left text-[13px] font-[700] ",
                index == dayIndex
                  ? "bg-[#7DAC04] text-[#F1FFCD]"
                  : "hover:bg-[#EEF4E5]"
              )}
            >
              Day {index + 1}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

export function ModuleSidebar({
  program,
  modIndex,
  dayIndex,
  onDayClicked,
  onModuleClicked
}: {
  program: any;
  modIndex: number;
  dayIndex: number;
  onDayClicked: ParamVoidCallback<number>;
  onModuleClicked: ParamVoidCallback<number>;
}) {
  // console.log(program.modules);
  return (
    <SideView>
      <div className='px-2'>
        <Link
          to='/s'
          className='-mx-2 h-28 w-28 shrink-0 self-start overflow-hidden rounded-full'
        >
          <img src='/logo-name.png' className='h-full w-full' />
        </Link>
        <h2 className='mt-10 text-3xl font-bold'>{program.name}</h2>

        <ul className='mt-8 w-full space-y-4 pb-10'>
          {program.modules.map((module: any, index: number) => (
            <ModuleButton
              key={module.id}
              active={index === modIndex}
              dayIndex={dayIndex}
              module={module}
              onDayClicked={onDayClicked}
              onClicked={() => onModuleClicked(index)}
            />
          ))}
        </ul>

        {/* <AccordionAlwaysOpen /> */}
      </div>
    </SideView>
  );
}
