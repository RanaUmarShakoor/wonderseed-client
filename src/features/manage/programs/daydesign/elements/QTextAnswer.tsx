import {
  RenderableElement,
  useOnCollected,
  useOnHydrated
} from "../DayDesignBase";
import { useRef } from "react";

export const QShortAnswer: RenderableElement = {
  id: "q-short",
  name: "Q. Short Answer",
  preview: (
    <div className='pin-center h-10 w-full border border-green-2/50 bg-[#F1F5F7]'>
      <span className='text-xl text-slate-400'>S.A</span>
    </div>
  ),
  Master: ({ instance }) => {
    const ref = useRef<HTMLTextAreaElement>(null);

    useOnHydrated(instance, (data: string) => (ref.current!.value = data));
    useOnCollected(instance, () => ref.current?.value ?? "");

    return (
      <textarea
        ref={ref}
        placeholder='Enter question'
        className='h-28 w-full rounded-sm border-2 border-[#C9DAD7] bg-transparent p-2'
      ></textarea>
    );
  }
};

export const QLongAnswer: RenderableElement = {
  id: "q-long",
  name: "Q. Long Answer",
  preview: (
    <div className='pin-center h-10 w-full border border-green-2/50 bg-[#F1F5F7]'>
      <span className='text-xl text-slate-400'>L.A</span>
    </div>
  ),
  Master: ({ instance }) => {
    const ref = useRef<HTMLTextAreaElement>(null);

    useOnHydrated(instance, (data: string) => (ref.current!.value = data));
    useOnCollected(instance, () => ref.current?.value ?? "");

    return (
      <textarea
        ref={ref}
        placeholder='Enter question'
        className='h-28 w-full rounded-sm border-2 border-[#C9DAD7] bg-transparent p-2'
      ></textarea>
    );
  }
};
