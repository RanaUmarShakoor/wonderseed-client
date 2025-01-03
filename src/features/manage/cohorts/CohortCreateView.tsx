import { useQueryClient } from "@tanstack/react-query";
import { apiConn, useGetProgram, useGetUsers } from "apiconn";
import { BackArrowButton } from "components/BackArrowButton";
import { ExpandedSpinner } from "components/Spinner";
import { useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Role } from "role";

export function CohortCreateView() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { programId } = useParams();
  const { register, handleSubmit } = useForm();

  let { data: program, isLoading } = useGetProgram(programId);
  let { data: users, isLoading: usersLoading } = useGetUsers();
  users = users?.filter((u: any) => u.role === Role.Teacher) || [];

  const onSubmit: SubmitHandler<any> = useCallback(
    async data => {
      let server_data = {
        program: programId,
        start_date: data.start_date,
        teacher: data.teacher_id
      };

      if (!(server_data.start_date && server_data.teacher && 1))
        return alert("Please fill all the fields");

      let resp = await apiConn.post("/cohorts/create", server_data);

      if (resp.data.status === "success") {
        queryClient.invalidateQueries({ queryKey: ["cohorts"] });

        navigate(-1);
      } else {
        alert("An error occured");
        console.log(resp.data);
      }
    },
    [programId]
  );

  if (isLoading || usersLoading)
    //
    return <ExpandedSpinner />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='mt-8'>
      <BackArrowButton />
      <h4 className='mb-4 text-4xl font-bold'>Add Cohort</h4>

      <header className='mb-8 flex items-start gap-x-4'>
        <div className='rounded-lg border bg-green-600/20 px-3 py-2'>
          <p className='text-sm text-black/50'>Program</p>
          <p className='mr-4 text-lg font-bold'>{program.name}</p>
        </div>
      </header>

      <div className='max-w-lg space-y-4'>
        <div className='floating-input'>
          <input
            {...register("start_date")}
            type='date'
            placeholder=' '
            size={1}
          />
          <label>Start Date</label>
        </div>

        <div className='flex flex-col items-start'>
          <label className='mb-3 pl-1 text-lg font-semibold'>Facilitator</label>
          <div className='floating-select w-full'>
            <select className='w-full' {...register("teacher_id")}>
              {users.map((u: any) => (
                <option key={u.id} value={u.id}>
                  {u.first_name} {u.last_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button type='submit' className='w-button mt-8'>
        Create
      </button>
    </form>
  );
}
