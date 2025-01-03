import { useState } from "react";
import { FAQCrud } from "./FAQCrud";
import { GuideInputs } from "./GuideInputs";

export default function ManageGuides() {
  const [panel, setPanel] = useState("student");

  return (
    <section className='mt-8'>
      <div className='flex flex-col items-start'>
        <label className='mb-3 pl-1 text-lg font-semibold'>Target</label>
        <div className='floating-select'>
          <select
            className=''
            value={panel}
            onChange={event => setPanel(event.currentTarget.value)}
          >
            <option value='teacher'>Facilitator Panel</option>
            <option value='student'>Student Panel</option>
            <option value='coach'>Coach Panel</option>
          </select>
        </div>
      </div>
      <hr className='my-4 border-2' />
      <h4 className='mb-8 text-4xl font-bold'>FAQs</h4>
      <FAQCrud panel={panel} />
      <hr className='my-4 border-2' />
      <GuideInputs panel={panel} />
    </section>
  );
}
