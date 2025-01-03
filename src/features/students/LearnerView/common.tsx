import { ReactNode } from "react";

export type CtrlSetHandle = number;
export type CtrlSetValue = { allowNext?: () => boolean };
export type CtrlSet = Record<CtrlSetHandle, CtrlSetValue>;

export type RenderElementProps = {
  elem: any;
  ctrlset: CtrlSet;
  handle: CtrlSetHandle;
  uniqID: string;
};
export type RenderElementComp = (props: RenderElementProps) => ReactNode;
export const re = (elem: (props: RenderElementProps) => ReactNode) => elem;


export function timeElapsedSince(datetime: Date) {
  var startDate = datetime;
  var endDate = new Date();
  var seconds = (endDate.getTime() - startDate.getTime()) / 1000;
  return seconds;
}