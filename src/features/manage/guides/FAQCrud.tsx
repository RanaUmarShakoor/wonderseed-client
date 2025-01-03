import { useQueryClient } from "@tanstack/react-query";
import { apiConn, useGetFaqs } from "apiconn";
import { ExpandedSpinner } from "components/Spinner";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function FaqForm({
  onSave,
  mode,
  question,
  answer,
  setQuestion,
  setAnswer
}: {
  onSave: (q: string, a: string) => void;
  mode: string;
  question: string;
  answer: string;
  setQuestion: Dispatch<SetStateAction<string>>;
  setAnswer: Dispatch<SetStateAction<string>>;
}) {
  return (
    <>
      <h5 className='mb-4 text-2xl font-bold'>
        {mode === "edit" ? "Edit" : "Add"} FAQ Entry
      </h5>
      <section className='mb-4 space-y-4'>
        <div className='flex flex-col gap-y-2'>
          <label>Question</label>
          <textarea
            placeholder=' '
            className='rounded-sm border-2 border-[#C9DAD7] bg-transparent p-2'
            value={question}
            onChange={event => setQuestion(event.currentTarget.value)}
          ></textarea>
        </div>
        <div className='flex flex-col gap-y-2'>
          <label>Answer</label>
          <textarea
            placeholder=' '
            className='rounded-sm border-2 border-[#C9DAD7] bg-transparent p-2'
            value={answer}
            onChange={event => setAnswer(event.currentTarget.value)}
          ></textarea>
        </div>
        <button className='w-button' onClick={() => onSave(question, answer)}>
          Save
        </button>
      </section>
    </>
  );
}

export function FaqTable({
  panel,
  onStartEdit,
  onDelete
}: {
  panel: string;
  onStartEdit: (faq: any) => void;
  onDelete: (faq: any) => void;
}) {
  const { data: faqs, isLoading: faqsLoading } = useGetFaqs();

  if (faqsLoading)
    //
    return <ExpandedSpinner />;

  return (
    <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
      <table className='w-full text-left text-sm'>
        <thead className='bg-green-1 text-xs uppercase text-white'>
          <tr className='whitespace-nowrap [&>th]:px-6 [&>th]:py-3'>
            <th>Question</th>
            <th>Answer</th>
            <th>
              <span className='sr-only'></span>
            </th>
          </tr>
        </thead>
        <tbody>
          {faqs
            .filter((f: any) => f.panel === panel)
            .map((faq: any, index: number) => (
              <tr
                key={index}
                className='border-b bg-white hover:bg-gray-50 [&>td]:px-6 [&>td]:py-3'
              >
                <td className='font-bold'>{faq.question}</td>
                <td className=''>{faq.answer}</td>
                <td className='whitespace-nowrap'>
                  <div className='flex items-center justify-end gap-x-3'>
                    <a
                      href='#'
                      onClick={() => onStartEdit(faq)}
                      className='text-blue-600 hover:underline'
                    >
                      Edit
                    </a>
                    <a
                      href='#'
                      onClick={() => onDelete(faq)}
                      className='text-red-600 hover:underline'
                    >
                      Delete
                    </a>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export function FAQCrud({ panel }: { panel: string }) {
  const queryClient = useQueryClient();

  const [mode, setMode] = useState("create");
  const [editId, setEditId] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    setMode("create");
    setQuestion("");
    setAnswer("");
  }, [panel]);

  const onStartEdit = (faq: any) => {
    setMode("edit");
    setEditId(faq.id);
    setQuestion(faq.question);
    setAnswer(faq.answer);
  };

  const onSave = async () => {
    if (!question || !answer) return;

    if (mode === "create") {
      let resp = await apiConn.post("/faqs/create", {
        panel,
        question,
        answer
      });
      console.log("Create", resp.data);
    } else if (mode === "edit") {
      let resp = await apiConn.post(`/faqs/update/${editId}`, {
        panel,
        question,
        answer
      });
      console.log("Edit", resp.data);
    }
    setMode("create");
    setQuestion("");
    setAnswer("");
    queryClient.invalidateQueries({ queryKey: ["faqs"] });
  };

  const onDelete = async (faq: any) => {
    console.log(faq);
    let resp = await apiConn.post(`/faqs/delete/${faq.id}`);
    console.log("Delete", resp.data);
    queryClient.invalidateQueries({ queryKey: ["faqs"] });
  };

  return (
    <>
      <FaqForm
        onSave={onSave}
        question={question}
        answer={answer}
        setQuestion={setQuestion}
        setAnswer={setAnswer}
        mode={mode}
      />
      <FaqTable panel={panel} onStartEdit={onStartEdit} onDelete={onDelete} />
    </>
  );
}
