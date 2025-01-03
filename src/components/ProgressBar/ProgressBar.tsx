import { HTMLProps } from "react";
import cx from "classnames";
import { motion } from "framer-motion";
import "./ProgressBar.scss";

export function ProgressBar({
  time,
  className,
  milestones,
  completedMilestones,
  ...html
}: {
  time: number;
  milestones?: number;
  completedMilestones?: number;
} & HTMLProps<HTMLDivElement>) {
  let completed = completedMilestones || 0;

  let width = `${clamp01(time) * 100}%`;

  return (
    <div {...html} className={cx("w-progress-bar", className)}>
      <div className='w-pg-mainbar'>
        <motion.div
          className='w-pg-inner'
          initial={{ width: width }}
          animate={{ width: width }}
        />
      </div>

      <div className='w-pg-dots'>
        {milestones !== undefined &&
          milestones > 0 &&
          [...Array(milestones)].map((_, index) => (
            <div
              key={index}
              data-completed={index < completed}
              className='w-pg-dots-inner'
            />
          ))}
      </div>
    </div>
  );
}

function clamp01(x: number) {
  if (x < 0) return 0;
  if (x > 1) return 1;

  return x;
}
