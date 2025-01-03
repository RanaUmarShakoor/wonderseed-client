import { Route, Routes } from "react-router-dom";
import { ListProgramsWithCohorts } from "./ListProgramsWithCohorts";
import { ProgramIndexView } from "./ProgramIndexView";
import { CohortIndexView } from "./CohortIndexView";
import { CohortCreateView } from "./CohortCreateView";

export default function ManageCohorts() {
  return (
    <Routes>
      <Route path='/' Component={ListProgramsWithCohorts} />
      <Route path='/program/:programId' Component={ProgramIndexView} />
      <Route path='/cohort/view/:cohortId' Component={CohortIndexView} />
      <Route path='/cohort/new/:programId' Component={CohortCreateView} />
    </Routes>
  );
}
