import { useParams } from "react-router-dom";
import { DayDesignBase } from "./DayDesignBase";
import { QSingleChoiceElement } from "./elements/QSingleChoiceElement";
import { QMultipleChoiceElement } from "./elements/QMultipleChoiceElement";
import { QRangeSliderElement } from "./elements/QRangeSliderElement";
import { HeaderElement } from "./elements/HeaderElement";
import { TextElement } from "./elements/TextElement";
import { QShortAnswer, QLongAnswer } from "./elements/QTextAnswer";
import { QMatrix } from "./elements/QMatrix";
import { hydrateDayDesign, saveDayDesign } from "./methods";

export function DayEditAssessment() {
  let { dayId } = useParams();

  return (
    <DayDesignBase
      title='Design Day Assessment'
      elementStore={[
        /* List of elements */
        HeaderElement,
        TextElement,
        QSingleChoiceElement,
        QMultipleChoiceElement,
        QRangeSliderElement,
        QShortAnswer,
        QLongAnswer,
        QMatrix
      ]}
      onSave={elements => saveDayDesign(dayId, "assessment", elements)}
      onHydrate={() => hydrateDayDesign(dayId, "assessment")}
    />
  );
}
