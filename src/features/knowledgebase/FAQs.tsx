import { memo, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cross from "./images/cross.svg";
import { motion } from "framer-motion";
import { produce } from "immer";
import { Role } from "role";
import { useGetFaqs } from "apiconn";
import { ExpandedSpinner } from "components/Spinner";
import { useAppStoreKey } from "stores/main";
import { filterPanel } from "utils";

const initialList = [
  {
    question: "Who all can access a course ?",
    answer:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr Lorem ipsum dolor sit amet, consetetur sadipscing elit rLorem ipsum dolor sit amet, consetetur sadipscing elitrL orem ipsum dolor sit amet, consetetur sadipscing elitr Lorem ipsum dolor sit amet, consetetur sadipscing elitr Lorem ipsum dolor sit amet, consetetur sadipscing elitr"
  },
  {
    question: "Where can I see my course completion certificate ?",
    answer:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr Lorem ipsum dolor sit amet, consetetur sadipscing elit rLorem ipsum dolor sit amet, consetetur sadipscing elitrL orem ipsum dolor sit amet, consetetur sadipscing elitr Lorem ipsum dolor sit amet, consetetur sadipscing elitr Lorem ipsum dolor sit amet, consetetur sadipscing elitr"
  },
  {
    question: "Where can I see my course completion certificate ?",
    answer:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr Lorem ipsum dolor sit amet, consetetur sadipscing elit rLorem ipsum dolor sit amet, consetetur sadipscing elitrL orem ipsum dolor sit amet, consetetur sadipscing elitr Lorem ipsum dolor sit amet, consetetur sadipscing elitr Lorem ipsum dolor sit amet, consetetur sadipscing elitr"
  },
  {
    question: "Where can I see my course completion certificate ?",
    answer:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr Lorem ipsum dolor sit amet, consetetur sadipscing elit rLorem ipsum dolor sit amet, consetetur sadipscing elitrL orem ipsum dolor sit amet, consetetur sadipscing elitr Lorem ipsum dolor sit amet, consetetur sadipscing elitr Lorem ipsum dolor sit amet, consetetur sadipscing elitr"
  }
];

const Entry = memo(
  ({
    id,
    onState,
    expanded,
    ...p
  }: {
    id: number;
    question: string;
    answer: string;
    expanded: boolean;
    onState: (id: number, state: boolean) => void;
  }) => {
    return (
      <div
        data-expanded={expanded}
        className='group border-2 border-[#E5E5E5] bg-white'
      >
        <header
          onClick={() => onState(id, !expanded)}
          className='flex cursor-pointer items-start gap-x-6 px-10 py-6'
        >
          <h2 className='flex-1 select-none text-2xl font-bold'>
            {p.question}
          </h2>
          <button
            onClick={() => onState(id, !expanded)}
            className='rounded-lg bg-[#E1EBD0] hover:bg-green-3/50'
          >
            <img
              className='rotate-0 transition-transform group-[&[data-expanded=true]]:rotate-45'
              src={Cross}
            />
          </button>
        </header>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: expanded ? "auto" : "0px" }}
          transition={{ duration: 0.2 }}
          className='overflow-hidden'
        >
          <p className='mx-10 mb-6 text-xl'>{p.answer}</p>
        </motion.div>
      </div>
    );
  }
);

type FaqStateListItem = {
  question: string;
  answer: string;
  expanded: boolean;
};

export function FAQs() {
  const auth = useAppStoreKey("auth");

  const { data: faqs, isLoading } = useGetFaqs({
    keepPreviousData: true,
    initialData: []
  });

  const [list, setList] = useState<FaqStateListItem[]>([]);

  useEffect(() => {
    setList(
      faqs
        .filter((faq: any) => filterPanel(faq.panel, auth.user?.role))
        .map((faq: any) => ({
          ...faq,
          expanded: false
        }))
    );
  }, [faqs]);

  const handleStateChange = useCallback((id: number, state: boolean) => {
    setList(
      produce(draft => {
        if (state)
          // If one of the items is being opened then close all the
          // other ones
          draft.forEach(d => (d.expanded = false));

        // Currently id is the index
        let ent = draft[id];
        ent.expanded = state;
      })
    );
  }, []);

  if (isLoading)
    //
    return <ExpandedSpinner />;

  return (
    // -mx-8 px-8: FIXME: Temporary hack to push the scrollbar on the
    // edge of screen
    <div className='sideview-content'>
      <Link to='../knowledge-base'>
        <img className='page-back-btn' src='/page-back.svg' />
      </Link>

      <h1 className='mt-5 text-4xl font-bold'>FAQs</h1>

      <section className='mt-9 flex flex-col gap-y-4'>
        {list.map((ent, index) => (
          <Entry
            key={index}
            id={index}
            question={ent.question}
            answer={ent.answer}
            expanded={ent.expanded}
            onState={handleStateChange}
          />
        ))}
      </section>
    </div>
  );
}
