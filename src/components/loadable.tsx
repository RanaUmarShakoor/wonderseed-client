import { LazyExoticComponent, Suspense } from "react";
import { ExpandedSpinner } from "components/Spinner";

import { lazy } from "react";

export default function loadable(
  Comp: LazyExoticComponent<any>,
  fallback?: NonNullable<React.ReactNode>
): React.ComponentType {
  if (fallback === undefined) fallback = <ExpandedSpinner />;

  return () => (
    <Suspense fallback={fallback}>
      <Comp />
    </Suspense>
  );
}

export function lazyload(
  Comp: Parameters<typeof lazy>[0],
  fallback?: NonNullable<React.ReactNode>
): React.ComponentType {
  return loadable(lazy(Comp), fallback);
}
