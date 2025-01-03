import {
  RenderableElement,
  useOnCollected,
  useOnHydrated
} from "../DayDesignBase";
import { useRef } from "react";
import { TextBox } from "./TextBox";
import { QuestionInput } from "./QuestionInput";
import { toNumOrNull } from "utils";

export const QRangeSliderElement: RenderableElement = {
  id: "q-slider",
  name: "Q. Range Slider",
  preview: (
    <div className='pin-center h-10 w-full border border-green-2/50 bg-[#F1F5F7]'>
      <span className='text-xl text-slate-400'>R</span>
    </div>
  ),
  Master: ({ instance }) => {
    const questionRef = useRef<HTMLTextAreaElement>(null);
    const startRef = useRef<HTMLInputElement>(null);
    const endRef = useRef<HTMLInputElement>(null);

    useOnHydrated(instance, data => {
      if (questionRef.current) questionRef.current.value = data.question;
      if (startRef.current)
        startRef.current.value = data.start?.toString() ?? "";
      if (endRef.current) endRef.current.value = data.end?.toString() ?? "";
    });
    useOnCollected(instance, () => ({
      question: questionRef.current?.value ?? "",
      start: toNumOrNull(startRef.current?.value || ""),
      end: toNumOrNull(endRef.current?.value || "")
    }));

    return (
      <div>
        <QuestionInput ref={questionRef} className='mb-3' />
        <section className='flex max-w-lg gap-x-4'>
          <TextBox
            ref={startRef}
            className='flex-1'
            placeholder='Enter start of range'
            type='text'
          />
          <TextBox
            ref={endRef}
            className='flex-1'
            placeholder='Enter end of range'
            type='text'
          />
        </section>
      </div>
    );
  }
};
