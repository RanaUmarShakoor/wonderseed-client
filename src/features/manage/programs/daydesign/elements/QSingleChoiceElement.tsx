import {
  RenderableElement,
  useOnCollected,
  useOnHydrated
} from "../DayDesignBase";
import { ReactNode, useRef, useState } from "react";
import { TextBox } from "./TextBox";
import { QuestionInput } from "./QuestionInput";
import { produce } from "immer";
import { AnswerOption } from "components/AnswerOption";
import cx from "classnames";

export const QSingleChoiceElement: RenderableElement = {
  id: "q-single",
  name: "Q. Single Choice",
  preview: (
    <div className='pin-center h-10 w-full border border-green-2/50 bg-[#F1F5F7]'>
      <span className='text-xl text-slate-400'>S.C</span>
    </div>
  ),
  Master: ({ instance }) => {
    const questionRef = useRef<HTMLTextAreaElement>(null);
    const [options, setOptions] = useState<string[]>([""]);
    const [selectMode, setSelectMode] = useState<"radio" | "dropdown">("radio");
    const [correctIndex, setCorrectIndex] = useState<number>(0);

    useOnHydrated(instance, (data: any) => {
      if (questionRef.current)
        //
        questionRef.current.value = data.question;
      setOptions(data.options || []);
      setSelectMode(data.selectMode || "radio");
      setCorrectIndex(data.correctIndex ?? 0);
    });
    useOnCollected(instance, () => ({
      question: questionRef.current?.value ?? "",
      selectMode,
      options,
      correctIndex
    }));

    const handleAdd = () =>
      setOptions(
        produce(draft => {
          draft.push("");
        })
      );
    const handleDel = () =>
      setOptions(
        produce(draft => {
          draft.length > 1 && draft.pop();
        })
      );
    const handleEdit = (
      index: number,
      event: React.FormEvent<HTMLInputElement>
    ) => {
      setOptions(
        produce(draft => {
          draft[index] = (event.target as HTMLInputElement).value || "";
        })
      );
    };

    let inputs = [] as ReactNode[];
    for (let i = 0; i < options.length; ++i) {
      inputs.push(
        <div key={i} className='flex gap-x-4'>
          <AnswerOption
            title='Mark this option as correct'
            checked={correctIndex === i}
            globalPrefix='design-q-s'
            onChange={val => val && setCorrectIndex(i)}
            qid={instance.renderedId}
            aid={i}
          />
          <TextBox
            value={options[i]}
            onChange={event => handleEdit(i, event)}
          />
        </div>
      );
    }

    return (
      <div>
        <QuestionInput ref={questionRef} className='mb-3' />
        <div className='flex items-start gap-x-4'>
          <section className='shrink-0 space-y-3'>
            <div className='flex flex-col items-start'>
              <label className='mb-3 pl-1 text-lg font-semibold'>
                Selection Mode
              </label>
              <div className='floating-select'>
                <select
                  value={selectMode}
                  onChange={event => setSelectMode(event.target.value as any)}
                >
                  <option value='radio'>Radio</option>
                  <option value='dropdown'>Dropdown</option>
                </select>
              </div>
            </div>
            <button onClick={handleAdd} className='w-button'>
              Add Entry
            </button>
            <button onClick={handleDel} className='w-button'>
              Delete Entry
            </button>
          </section>
          <section className='flex-1 space-y-3'>{inputs}</section>
        </div>
      </div>
    );
  }
};
