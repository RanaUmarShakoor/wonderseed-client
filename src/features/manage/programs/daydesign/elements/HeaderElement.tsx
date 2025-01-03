import { useRef } from "react";
import {
  RenderableElement,
  useOnCollected,
  useOnHydrated
} from "../DayDesignBase";

export const HeaderElement: RenderableElement = {
  id: "heading",
  name: "Heading",
  preview: (
    <div className='pin-center h-10 w-full border border-green-2/50 bg-[#F1F5F7]'>
      <span className='text-xl text-slate-400'>H1</span>
    </div>
  ),
  Master: ({ instance }) => {
    const ref = useRef<HTMLInputElement>(null);

    useOnHydrated(instance, (data: string) => (ref.current!.value = data));
    useOnCollected(instance, () => ref.current?.value ?? "");

    return (
      <input
        ref={ref}
        placeholder='Enter heading'
        className='w-full rounded-sm border-2 border-[#C9DAD7] bg-transparent p-2'
      />
    );
  }
};
