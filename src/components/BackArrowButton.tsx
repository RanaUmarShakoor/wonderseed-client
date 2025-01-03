import { Link, useNavigate } from "react-router-dom";

export function BackArrowButton({
  useLink,
  to
}: {
  useLink?: boolean;
  to?: string;
}) {
  const navigate = useNavigate();
  const className = "mb-5 block";
  const inner = <img className='page-back-btn' src='/page-back.svg' />;

  let href = to === undefined ? ".." : to;

  if (useLink)
    return (
      <Link to={href} className={className}>
        {inner}
      </Link>
    );

  return (
    <button
      onClick={e => {
        navigate(-1);
      }}
      type='button'
      className={className}
    >
      {inner}
    </button>
  );
}
