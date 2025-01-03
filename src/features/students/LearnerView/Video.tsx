import { resolveUploadUrl } from "apiconn";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

import { useEffect, useRef } from "react";
import { re } from "./common";

function targetSeekTime(event: Plyr.PlyrEvent) {
  if (event.type === "input" || event.type === "change") {
    let slider = event.target as HTMLInputElement | null;
    if (!slider) return 0;

    // FIXME: What if max is not set? What would slider.value represent then ?
    return +slider.value / +slider.max;
  }

  return Number(event as any);
}

function currentVideoTime(player: Plyr) {
  return player.currentTime / player.duration;
}

export const Video = re(({ elem, handle, ctrlset }) => {
  const videoElemRef = useRef<HTMLVideoElement>(null);
  const endedRef = useRef(false);

  useEffect(() => {
    if (videoElemRef.current === null)
      //
      return;

    let player = new Plyr(videoElemRef.current, {
      listeners: {
        seek(event) {
          if (targetSeekTime(event) > currentVideoTime(player)) {
            event.preventDefault();
            return false;
          }
        }
      }
    });

    player.on("ended", event => {
      endedRef.current = true;
      console.log("Ended");
    });

    ctrlset[handle] = {
      allowNext: () => endedRef.current
    };
  }, []);

  return (
    <div id='mod-video-container'>
      <div id='mod-video-rounded-wrapper'>
        <video ref={videoElemRef} controls crossOrigin='' playsInline>
          <source src={resolveUploadUrl(elem.data.filePath)} type='video/mp4' />
        </video>
      </div>
    </div>
  );
});
