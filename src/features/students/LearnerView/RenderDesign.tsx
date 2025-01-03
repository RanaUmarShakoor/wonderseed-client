import { resolveUploadUrl } from "apiconn";
import { Fragment, ReactNode, createContext, useEffect, useRef } from "react";
import { Video } from "./Video";
import { CtrlSet, RenderElementComp, re } from "./common";
import cx from "classnames";
import { AnswerOption } from "components/AnswerOption";

const answersRepo: Record<number, any> = {};
// @ts-ignore
window.answersRepo = answersRepo;

const Heading = re(({ elem }) => (
  <h4 className='max-w-[700px] text-2xl font-bold 2xl:max-w-[850px]'>
    {elem.data}
  </h4>
));

const Paragraph = re(({ elem }) => (
  <p className='w-full max-w-[700px] whitespace-pre-wrap font-semibold text-[rgb(18,53,46)] 2xl:max-w-[850px]'>
    {elem.data}
  </p>
));

const Image = re(({ elem }) => (
  <img
    className='w-full max-w-[850px] py-4'
    src={resolveUploadUrl(elem.data.filePath)}
  />
));

const SingleChoice = re(({ elem: { data }, handle, uniqID }) => {
  let answers: ReactNode = null;

  if (data.selectMode === "radio")
    answers = (
      <div className='grid max-w-[700px] grid-cols-1 gap-x-3 gap-y-4 lg:grid-cols-[1fr_1fr] 2xl:max-w-[850px]'>
        {data.options.map((opt: any, index: number) => (
          <AnswerOption
            className='flex-1'
            globalPrefix='render-q-s'
            key={index}
            qid={handle}
            aid={index}
            value={opt}
            defaultChecked={answersRepo[uniqID] == index}
            onChange={() => (answersRepo[uniqID] = index)}
          />
        ))}
      </div>
    );
  else
    answers = (
      <div className='floating-select max-w-[700px] 2xl:max-w-[850px]'>
        <select
          defaultValue={answersRepo[uniqID] || ""}
          onChange={e => {
            answersRepo[uniqID] = e.target.value;
          }}
        >
          {data.options.map((opt: any, index: number) => (
            <option key={index} value={index}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );

  return (
    <div className='bg-white px-6 py-4'>
      <h3 className='mb-4 font-bold'>{data.question}</h3>

      {answers}
    </div>
  );
});

const MultipleChoice = re(({ elem: { data }, handle, uniqID }) => {
  function arrAddUnique(arr: any[], value: any) {
    if (arr.indexOf(value) == -1) arr.push(value);
  }
  function arrDel(arr: any[], value: any) {
    let index = arr.indexOf(value);
    if (index != -1) arr.splice(index, 1);
  }
  function repoArr(id: string): any[] {
    return (answersRepo[id] = answersRepo[id] ?? []);
  }

  let answers = (
    <div className='max-w-[700px] 2xl:max-w-[850px] grid grid-cols-1 gap-x-3 gap-y-4 lg:grid-cols-[1fr_1fr]'>
      {data.options.map((opt: any, index: number) => (
        <AnswerOption
          className='flex-1'
          globalPrefix='render-q-m'
          multiple
          key={index}
          qid={handle}
          aid={index}
          value={opt}
          defaultChecked={repoArr(uniqID).includes(index)}
          onChange={checked => {
            console.log(checked, index);
            let arr = repoArr(uniqID);
            if (checked) arrAddUnique(arr, index);
            else arrDel(arr, index);
          }}
        />
      ))}
    </div>
  );

  return (
    <div className='bg-white px-6 py-4'>
      <h3 className='mb-4 font-bold'>{data.question}</h3>
      {answers}
    </div>
  );
});

const ShortAnswer = re(({ elem: { data }, uniqID }) => {
  return (
    <div className='bg-white px-6 py-4'>
      <h3 className='mb-4 font-bold'>{data}</h3>
      <input
        placeholder='Enter Answer'
        className={cx(
          "w-full max-w-4xl rounded-sm border-2 border-[#C9DAD7] bg-transparent p-2"
        )}
        defaultValue={answersRepo[uniqID] || ""}
        onChange={e => {
          answersRepo[uniqID] = e.target.value;
        }}
      />
    </div>
  );
});

const LongAnswer = re(({ elem: { data }, handle, uniqID }) => {
  return (
    <div className='bg-white px-6 py-4'>
      <h3 className='mb-4 font-bold'>{data}</h3>
      <textarea
        placeholder='Enter Answer'
        className={cx(
          "w-full max-w-4xl rounded-sm border-2 border-[#C9DAD7] bg-transparent p-2"
        )}
        defaultValue={answersRepo[uniqID] || ""}
        onChange={e => {
          answersRepo[uniqID] = e.target.value;
        }}
      ></textarea>
    </div>
  );
});

const Matrix = re(({ elem: { data }, handle, uniqID }) => {
  let cols: string[] = data.colVals || [];
  let rows: string[] = data.rowVals || [];

  let nCols = cols.length;
  let nRows = rows.length;

  function repoArr() {
    let arr = answersRepo[uniqID] ?? [];
    answersRepo[uniqID] = arr;
    return arr;
  }

  if (nCols == 0 || nRows == 0) return null;

  let vertical = (
    <div style={{ gridArea: `1 / 2 / span ${nRows + 2} / span 1` }}>
      <div className='mx-0 h-full w-0.5 bg-gray-300'></div>
    </div>
  );

  let horizontal = (
    <div style={{ gridArea: `2 / 1 / span 1 / span ${nCols + 2}` }}>
      <div className='my-0 h-0.5 w-full bg-gray-300'></div>
    </div>
  );

  return (
    <div className='bg-white px-6 py-4'>
      <h3 className='mb-2 font-bold'>{data.question}</h3>

      <div
        style={{
          gridTemplateColumns: `fit-content(100px) auto repeat(${nCols}, 1fr)`,
          gridAutoRows: `auto auto repeat(${nRows}, 1fr)`
        }}
        className='grid gap-x-4 gap-y-4 max-w-[700px] 2xl:max-w-[850px]'
      >
        <div className='col-[3/-1] grid grid-cols-[subgrid]'>
          {cols.map(col => (
            <div key={col} className='pin-center text-center font-bold'>
              {col}
            </div>
          ))}
        </div>

        {vertical}
        {horizontal}

        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            style={{ gridRow: `${3 + rowIndex} / span 1` }}
            className='col-[1/-1] grid grid-cols-[subgrid]'
          >
            <div className='text-center font-bold'>{row}</div>
            <div className='col-[3/-1] grid grid-cols-[subgrid]'>
              {cols.map((_, colIndex) => (
                <div key={colIndex} className='pin-center'>
                  <AnswerOption
                    globalPrefix='render-q-mat'
                    qid={handle + "r" + rowIndex}
                    aid={colIndex}
                    defaultChecked={repoArr()[rowIndex * nCols + colIndex]}
                    onChange={checked => {
                      repoArr()[rowIndex * nCols + colIndex] = checked;
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

const idToComp: Record<string, RenderElementComp> = {
  heading: Heading,
  paragraph: Paragraph,
  image: Image,
  video: Video,
  "q-single": SingleChoice,
  "q-multiple": MultipleChoice,
  "q-short": ShortAnswer,
  "q-long": LongAnswer,
  "q-matrix": Matrix
};

export function RenderDesign({
  design,
  ctrlset,
  viewID
}: {
  design: any[];
  ctrlset: CtrlSet;
  viewID: string;
}) {
  const renderedList = design
    .map((elem: any, index: number) => {
      // console.log("ELEM", elem);

      let Comp = idToComp[elem.id] ?? null;
      if (Comp == null) return null;

      return (
        <Fragment key={index}>
          <Comp
            elem={elem}
            handle={index}
            ctrlset={ctrlset}
            uniqID={viewID + index.toString() + "-"}
          />
        </Fragment>
      );
    })
    .filter(Boolean);

  return renderedList;
}
