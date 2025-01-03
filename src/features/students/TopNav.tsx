import { Link, useMatch } from "react-router-dom";
import IconMessages from "./images/messages-2.png";
import cx from "classnames";
import { useAppStoreKey } from "stores/main";

function TopNavLink({
  label,
  icon,
  ...p
}: {
  highlightBaseUrl?: string;
  to: string;
  label?: string;
  icon?: string;
  className?: string;
}) {
  let baseUrl = p.highlightBaseUrl || p.to;
  const pageMatched = useMatch(baseUrl + "/*") !== null;

  return (
    <Link
      to={p.to}
      data-nobar={!!icon}
      data-active={pageMatched}
      className={cx("flex items-center", p.className)}
    >
      {icon && (
        <div
          className={cx(
            "flex h-0 items-center overflow-visible",
            label && "mr-2"
          )}
        >
          <img className='w-20 max-w-none' src={icon} />
        </div>
      )}
      {label}
    </Link>
  );
}

export function TopNav() {
  const cohortConfirmed = useAppStoreKey("cohortConfirmed");

  return (
    <nav id='st-top-navlink'>
      {cohortConfirmed && (
        <TopNavLink
          highlightBaseUrl='/s/program'
          to='/s/program/welcome'
          label='My Program'
        />
      )}
      {cohortConfirmed && <TopNavLink to='/s/progress' label='My Progress' />}
      <TopNavLink to='/s/info' label='FAQs' />
      <TopNavLink to='/s/profile' label='Profile' />
      {cohortConfirmed && <TopNavLink icon={IconMessages} to='/s/chat' />}
    </nav>
  );
}
