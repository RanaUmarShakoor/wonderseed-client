import { calcProgress, studentLearningTime } from "utils";
import writeXlsxFile from "write-excel-file";

const HEADER_ROW = [
  {
    value: "Email",
    fontWeight: "bold"
  },
  {
    value: "ID",
    fontWeight: "bold"
  },
  {
    value: "Progress",
    fontWeight: "bold"
  },
  {
    value: "Current Module",
    fontWeight: "bold"
  },
  {
    value: "Time Spent",
    fontWeight: "bold"
  }
];

export async function handleDownloadCohort(cohort: any, student?: any) {
  if (cohort == undefined)
    //
    return;

  let data = [HEADER_ROW];

  let program = cohort.program;
  let students = cohort.students;
  for (let i = 0; i < students.length; ++i) {
    let st = students[i];

    if (student !== undefined && st.user.id !== student.id) continue;

    let { progress, modSerial } = calcProgress(program, st);
    const learningTime = studentLearningTime(st);

    let row = [
      // Email
      st.user.email,
      // ID
      st.user.id,
      // Progress
      `${Math.round(progress * 100)}%`,
      // Current Module
      modSerial.toString(),
      // Time Spent
      learningTime
    ];

    row = row.map(value => ({ value, type: String }));
    data.push(row);
  }

  let filename = `Cohort-${cohort.app_id}`;
  if (student !== undefined) filename += `-Student-${student.app_id}`;

  // @ts-ignore
  await writeXlsxFile(data, {
    fileName: `${filename}.xlsx`
  });
}
