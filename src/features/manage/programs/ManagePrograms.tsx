import { Route, Routes } from "react-router-dom";
import { ProgramListView } from "./ProgramListView";
import { ProgramIndexView } from "./ProgramIndexView";
import { ModuleIndexView } from "./ModuleIndexView";
import { DayIndexView } from "./DayIndexView";
import { ProgramFormView } from "./ProgramFormView";
import { DayEditContent } from "./daydesign/DayEditContent";
import { DayEditAssessment } from "./daydesign/DayEditAssessment";
import { ProgramDesignPreassessment } from "./daydesign/ProgramDesignPreassessment";

export default function ManagePrograms() {
  return (
    <Routes>
      <Route path='/' Component={ProgramListView} />
      <Route path='/program/new' Component={ProgramFormView} />
      <Route path='/program/edit/:programId' Component={ProgramFormView} />
      <Route
        path='/program/design-ps/:programId'
        Component={ProgramDesignPreassessment}
      />
      <Route path='/program/:programId' Component={ProgramIndexView} />

      <Route path='/module/new/:programId' Component={ModuleIndexView} />
      <Route path='/module/:moduleId' Component={ModuleIndexView} />

      <Route path='/day/new/:moduleId' Component={DayIndexView} />
      <Route path='/day/:dayId' Component={DayIndexView} />

      <Route path='/day/:dayId/edit/content' Component={DayEditContent} />
      <Route path='/day/:dayId/edit/assessment' Component={DayEditAssessment} />
    </Routes>
  );
}
