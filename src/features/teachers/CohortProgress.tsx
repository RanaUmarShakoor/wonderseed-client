import { CohortProgressView } from "components/CohortProgressView/CohortProgressView";
import { Link, useNavigate, useParams } from "react-router-dom";

export function CohortProgress() {
  const navigate = useNavigate();
  const { cohortId } = useParams();

  return (
    // -mx-8 px-8: FIXME: Temporary hack to push the scrollbar on the
    // edge of screen
    <div className='sideview-content'>
      <button
        onClick={e => {
          navigate(-1);
        }}
        type='button'
        className='flex items-center gap-x-4'
      >
        <img className='page-back-btn' src='/page-back.svg' />
        <span className='text-lg'>Select other cohort</span>
      </button>
      <CohortProgressView cohortId={cohortId} />
    </div>
  );
}
