import {
  RenderableElement,
  useOnCollected,
  useOnHydrated
} from "../DayDesignBase";
import { useLayoutEffect, useRef, useState } from "react";
import { TextBox } from "./TextBox";
import { QuestionInput } from "./QuestionInput";
import { toNumOrNull } from "utils";
import { produce } from "immer";

export const QMatrix: RenderableElement = {
  id: "q-matrix",
  name: "Q. Matrix",
  preview: (
    <div className='pin-center h-10 w-full border border-green-2/50 bg-[#F1F5F7]'>
      <span className='text-xl text-slate-400'>X/Y</span>
    </div>
  ),
  Master: ({ instance }) => {
    const questionRef = useRef<HTMLTextAreaElement>(null);

    const [rowVals, setRowVals] = useState<string[]>([""]);
    const [colVals, setColVals] = useState<string[]>([""]);

    const rowCountNum = rowVals.length;
    const colCountNum = colVals.length;

    const handleAdd = (setter: typeof setRowVals) =>
      setter(
        produce(draft => {
          draft.push("");
        })
      );

    const handleDel = (setter: typeof setRowVals) =>
      setter(
        produce(draft => {
          draft.length > 1 && draft.pop();
        })
      );

    const handleEdit = (
      setter: typeof setRowVals,
      index: number,
      event: React.FormEvent<HTMLInputElement>
    ) => {
      setter(
        produce(draft => {
          draft[index] = (event.target as HTMLInputElement).value || "";
        })
      );
    };

    useOnHydrated(instance, data => {
      if (questionRef.current) questionRef.current.value = data.question;
      setRowVals(data.rowVals || []);
      setColVals(data.colVals || []);
    });

    useOnCollected(instance, () => ({
      question: questionRef.current?.value ?? "",
      rowVals,
      colVals
    }));

    return (
      <div>
        <QuestionInput ref={questionRef} className='mb-3' />
        <hr className='my-3.5' />
        <h2 className='text-sm font-bold uppercase'>Columns</h2>
        <section className='mt-3 flex max-w-lg gap-x-4'>
          <button onClick={() => handleAdd(setColVals)} className='w-button'>Add Column</button>
          <button onClick={() => handleDel(setColVals)} className='w-button'>Delete Column</button>
        </section>
        <section className='space-y-2 mt-3'>
          {[...Array(colCountNum)].map((_, index) => (
            <TextBox
              key={index}
              value={colVals[index]}
              onChange={event => handleEdit(setColVals, index, event)}
              placeholder={`Enter col # ${index + 1}`}
              type='text'
            />
          ))}
        </section>
        <hr className='my-3.5' />
        <h2 className='text-sm font-bold uppercase'>Rows</h2>
        <section className='mt-3 flex max-w-lg gap-x-4'>
          <button onClick={() => handleAdd(setRowVals)} className='w-button'>Add Row</button>
          <button onClick={() => handleDel(setRowVals)} className='w-button'>Delete Row</button>
        </section>
        <section className='space-y-2 mt-3'>
          {[...Array(rowCountNum)].map((_, index) => (
            <TextBox
              key={index}
              value={rowVals[index]}
              onChange={event => handleEdit(setRowVals, index, event)}
              placeholder={`Enter row # ${index + 1}`}
              type='text'
            />
          ))}
        </section>
      </div>
    );
  }
};
