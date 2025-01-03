import { DayDesignBase } from "./DayDesignBase";

import { useParams } from "react-router-dom";

import { HeaderElement } from "./elements/HeaderElement";
import { TextElement } from "./elements/TextElement";
import { ImageElement } from "./elements/ImageElement";
import { VideoElement } from "./elements/VideoElement";
import { hydrateDayDesign, saveDayDesign } from "./methods";

export function DayEditContent() {
  let { dayId } = useParams();

  return (
    <DayDesignBase
      title='Design Day Content'
      elementStore={[HeaderElement, TextElement, ImageElement, VideoElement]}
      onSave={elements => saveDayDesign(dayId, "content", elements)}
      onHydrate={() => hydrateDayDesign(dayId, "content")}
    />
  );
}
