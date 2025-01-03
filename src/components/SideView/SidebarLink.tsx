import { motion, AnimatePresence } from "framer-motion";
import { useSideView } from "./SideView";
import { Link, LinkProps, useMatch } from "react-router-dom";
import { HTMLProps } from "react";
import cx from "classnames";
import * as anims from "anims";

export function SidebarLink({
  iconURL,
  matchBaseUrl,
  to,
  label,
  className,
  ...p
}: {
  iconURL?: string;
  matchBaseUrl?: string;
  to: string;
  label: string;
} & LinkProps) {
  const { collapsed } = useSideView();
  const pageMatched = useMatch((matchBaseUrl || "") + to + "/*") !== null;

  return (
    <Link
      {...p}
      to={to}
      data-active={pageMatched}
      className={cx("sidebar-link")}
    >
      {iconURL && <img src={iconURL} />}
      <AnimatePresence>
        {!collapsed.value && (
          <motion.span
            key='label'
            {...anims.fadeInOut}
            className='whitespace-nowrap'
          >
            {label}
          </motion.span>
        )}
        {!collapsed.value && (
          <motion.div key='arrow' {...anims.fadeInOut} className='arrow-head' />
        )}
      </AnimatePresence>
    </Link>
  );
}

export function SidebarLinks({
  children,
  className,
  ...props
}: HTMLProps<HTMLDivElement>) {
  return (
    <nav
      {...props}
      className={cx(
        "mt-11 flex shrink-0 flex-col gap-y-0.5 self-stretch",
        className
      )}
    >
      {children}
    </nav>
  );
}
