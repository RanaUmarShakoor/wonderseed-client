import { useParams } from "react-router-dom";
import { DayDesignBase } from "./DayDesignBase";
import { QSingleChoiceElement } from "./elements/QSingleChoiceElement";
import { QMultipleChoiceElement } from "./elements/QMultipleChoiceElement";
import { QRangeSliderElement } from "./elements/QRangeSliderElement";
import { HeaderElement } from "./elements/HeaderElement";
import { TextElement } from "./elements/TextElement";
import { QShortAnswer, QLongAnswer } from "./elements/QTextAnswer";
import { QMatrix } from "./elements/QMatrix";
import { hydratePreassessmentDesign, savePreassessmentDesign } from "./methods";

export function ProgramDesignPreassessment() {
  let { programId } = useParams();

  return (
    <DayDesignBase
      title='Design Program Preassessment'
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
      onSave={elements => savePreassessmentDesign(programId, elements)}
      // onSave={elements => console.log(programId, elements)}
      onHydrate={() => hydratePreassessmentDesign(programId)}
    />
  );
}
