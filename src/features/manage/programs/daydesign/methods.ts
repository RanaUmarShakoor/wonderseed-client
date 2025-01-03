import { apiConn } from "apiconn";
import { type CollectedElement } from "./DayDesignBase";

export type FillType = "content" | "assessment";

export async function saveDayDesign(
  dayId: any,
  fillType: FillType,
  elements: CollectedElement[]
) {
  let res = await apiConn.post(`/day/${dayId}/design-fill`, {
    fillType,
    elements
  });
  console.log("save(): [result] ", res.data);
}

export async function hydrateDayDesign(dayId: any, fillType: FillType) {
  let res = await apiConn.get(`/day/${dayId}/design?fillType=${fillType}`);
  let elements = res.data.content;
  console.log("hydrate(): [result] ", elements);
  return elements;
}

export async function savePreassessmentDesign(
  programId: any,
  elements: CollectedElement[]
) {
  let res = await apiConn.post(`/programs/update-preassessment/${programId}`, {
    elements
  });
  console.log("[ps] save(): [result] ", res.data);
}

export async function hydratePreassessmentDesign(programId: any) {
  let res = await apiConn.get(`/program/${programId}`);
  let program = res.data.content;
  let elements = program.preassessment_content || [];
  console.log("[ps] hydrate(): [result] ", elements);
  return elements;
}
