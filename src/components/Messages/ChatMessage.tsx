import { PropsWithChildren } from "react";

export function ChatMessage(
  p: PropsWithChildren & { source: "self" | "other" }
) {
  return (
    <div data-source={p.source} className='message'>
      <>{p.children}</>
    </div>
  );
}
