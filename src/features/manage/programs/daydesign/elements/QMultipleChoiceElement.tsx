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

export const QMultipleChoiceElement: RenderableElement = {
  id: "q-multiple",
  name: "Q. Multiple Choice",
  preview: (
    <div className='pin-center h-10 w-full border border-green-2/50 bg-[#F1F5F7]'>
      <span className='text-xl text-slate-400'>M.C</span>
    </div>
  ),
  Master: ({ instance }) => {
    const questionRef = useRef<HTMLTextAreaElement>(null);
    const [options, setOptions] = useState<string[]>([""]);
    const [correctIndices, setCorrectIndices] = useState<number[]>([]);

    useOnHydrated(instance, (data: any) => {
      if (questionRef.current)
        //
        questionRef.current.value = data.question;
      setOptions(data.options || []);
      setCorrectIndices(data.correctIndices || []);
    });

    useOnCollected(instance, () => ({
      question: questionRef.current?.value ?? "",
      options,
      correctIndices
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
            title="Mark this option as correct"
            multiple
            globalPrefix='design-q-m'
            qid={instance.renderedId}
            aid={i}
            checked={correctIndices.includes(i)}
            onChange={checked => {
              setCorrectIndices(
                produce(draft => {
                  let oldIndex = draft.indexOf(i);
                  if (checked) {
                    if (oldIndex === -1) draft.push(i);
                  } else {
                    if (oldIndex !== -1) draft.splice(oldIndex, 1);
                  }
                })
              );
            }}
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
