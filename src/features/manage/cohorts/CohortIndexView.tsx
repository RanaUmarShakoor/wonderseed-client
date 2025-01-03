import cx from "classnames";
import { useQueryClient } from "@tanstack/react-query";
import { apiConn, useGetCohort, useGetUsers } from "apiconn";
import { BackArrowButton } from "components/BackArrowButton";
import { ExpandedSpinner } from "components/Spinner";
import { handleDownloadCohort } from "download-progress";
import { useCallback, useEffect,  useState } from "react";
import { useParams } from "react-router-dom";
import { Role } from "role";
import { calcProgress, studentLearningTime, useCurrentUser } from "utils";

import { Confirm } from "notiflix";

function StudentTable({
  cohort,
  students,
  onRemove
}: {
  cohort: any;
  students: any[];
  onRemove: (studentId: any) => void;
}) {
  const program = cohort.program;
  const { isResearcher } = useCurrentUser();

  return (
    <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
      <table className='w-full text-left text-sm'>
        <thead className='bg-green-1 text-xs uppercase text-white'>
          <tr className='whitespace-nowrap [&>th]:px-6 [&>th]:py-3'>
            <th>Email</th>
            <th>ID</th>
            <th>Progress</th>
            <th>Current Module</th>
            <th>Time Spent</th>
            <th>
              <span className='sr-only'></span>
            </th>
          </tr>
        </thead>
        <tbody>
          {students.map(st => {
            let { progress, modSerial } = calcProgress(program, st);
            const learningTime = studentLearningTime(st);
            return (
              <tr
                key={st.id}
                className='border-b bg-white hover:bg-gray-50 [&>td]:px-6 [&>td]:py-3'
              >
                <td className='whitespace-nowrap'>{st.user.email}</td>
                <td>{st.user.app_id}</td>
                <td>{Math.round(progress * 100)}%</td>
                <td>{modSerial}</td>
                <td>{learningTime}</td>
                <td className='whitespace-nowrap'>
                  <div className='flex items-center justify-end gap-x-3'>
                    <button
                      onClick={() => handleDownloadCohort(cohort, st.user)}
                      className='text-blue-600 hover:underline'
                    >
                      Download Report
                    </button>
                    {!isResearcher && (
                      <button
                        onClick={() => onRemove(st.user.id)}
                        className='text-red-600 hover:underline'
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function CohortIndexView() {
  const { isResearcher } = useCurrentUser();
  const queryClient = useQueryClient();
  const { cohortId } = useParams();

  const { data: cohort, isLoading } = useGetCohort(cohortId);
  let { data: users, isLoading: usersLoading } = useGetUsers();

  const [teacherID, setTeacherID] = useState("");
  useEffect(() => cohort && setTeacherID(cohort.teacher.id), [cohort]);
  const handleTeacherUpdate = useCallback(async () => {
    let resp = await apiConn.post(`/cohorts/update/${cohortId}`, {
      teacher: teacherID
    });
    queryClient.invalidateQueries({ queryKey: ["cohort", cohortId] });
    console.log(resp.data, teacherID);
    alert("Updated");
  }, [cohortId, teacherID]);

  const [studentID, setStudentID] = useState("");
  const handleAddStudent = useCallback(async () => {
    if (studentID === "") return;
    let resp = await apiConn.post(`/cohorts/add-student/${cohortId}`, {
      student: studentID
    });
    queryClient.invalidateQueries({ queryKey: ["cohort", cohortId] });
    console.log(resp.data, studentID);
    alert(resp.data.message);
    setStudentID("");
  }, [cohortId, studentID]);

  const handleEndCohort = useCallback(async () => {
    Confirm.show(
      "Confirm",
      "Are you sure you want to end cohort?",
      "Yes",
      "No",
      async () => {
        let resp = await apiConn.post(`/cohorts/update/${cohortId}`, {
          status: "completed",
          end_date: new Date().toJSON().slice(0, 10).replace(/-/g, "-")
        });
        queryClient.invalidateQueries({ queryKey: ["cohort", cohortId] });
        console.log(resp.data);
      },
      () => {},
      {}
    );
  }, [cohortId]);

  const handleRemoveStudent = useCallback(
    async (studentID: any) => {
      if (studentID === "") return;
      let resp = await apiConn.post(`/cohorts/remove-student/${cohortId}`, {
        student: studentID
      });
      queryClient.invalidateQueries({ queryKey: ["cohort", cohortId] });
      console.log(resp.data, studentID);
      alert("Removed");
    },
    [cohortId, studentID]
  );

  if (isLoading || usersLoading) return <ExpandedSpinner />;

  let { status } = cohort;
  users = users?.filter((u: any) => u.role === Role.Teacher) || [];
  users = users?.filter((u: any) => u.program.id === cohort.program.id) || [];

  return (
    <section className='mt-8' data-cid={cohort.id}>
      <BackArrowButton />
      <header className='flex'>
        <h4 className='mb-4 text-4xl font-bold'>Cohort {cohort.app_id}</h4>
        <button
          onClick={() => handleDownloadCohort(cohort)}
          className='w-button ml-auto'
        >
          Download Report
        </button>
        {!isResearcher && (
          <button
            className='w-button ml-4'
            onClick={handleEndCohort}
            disabled={status === "completed"}
          >
            End Cohort
          </button>
        )}
      </header>

      <header className='mb-4 flex items-start gap-x-4'>
        <div className='rounded-lg border bg-black/[0.04] px-3 py-2'>
          <p className='text-sm text-black/50'>Status</p>
          <p
            className={cx(
              "mr-4 text-lg font-bold",
              status == "active" ? "text-green-500" : "text-orange-500"
            )}
          >
            {status == "active" ? "Active" : "Completed"}
          </p>
        </div>
      </header>

      <section className='mb-12 flex items-end gap-x-4'>
        <div className='flex flex-col items-start'>
          <label className='mb-3 pl-1 text-lg font-semibold'>Facilitator</label>
          <div className='floating-select'>
            <select
              disabled={isResearcher}
              value={teacherID}
              onChange={event => setTeacherID(event?.currentTarget.value)}
            >
              {users.map((u: any) => (
                <option key={u.id} value={u.id}>
                  {u.first_name} {u.last_name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {!isResearcher && (
          <button onClick={handleTeacherUpdate} className='w-button'>
            Update
          </button>
        )}
      </section>

      {!isResearcher && (
        <section className='flex items-center gap-x-2'>
          <div className='floating-input mb-6 md:w-72'>
            <input
              value={studentID}
              onChange={event => setStudentID(event?.currentTarget.value)}
              placeholder=' '
              required
              size={1}
            />
            <label>Student Id</label>
          </div>

          <section className='mb-4 flex gap-x-2'>
            <button
              type='button'
              onClick={handleAddStudent}
              className='w-button'
            >
              Add Student
            </button>
            {/*
          <button className='w-button w-button-outline'>Import from CSV</button>
           */}
          </section>
        </section>
      )}

      <StudentTable
        cohort={cohort}
        onRemove={handleRemoveStudent}
        students={cohort.students}
      />
    </section>
  );
}
