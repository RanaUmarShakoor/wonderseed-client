import { useQueryClient } from "@tanstack/react-query";
import { apiConn, useGetPrograms, useGetUser } from "apiconn";
import { BackArrowButton } from "components/BackArrowButton";
import { ExpandedSpinner } from "components/Spinner";
import { useCallback, useRef, useState } from "react";
import { Ellipsis } from "react-css-spinners";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Role, iterRoles } from "role";
import { useAutoFillEffect, useCurrentUser } from "utils";

export function UserIndexView() {
  const { currentUser, isSuperAdmin } = useCurrentUser();
  const excludeAvailableRole: Role[] = isSuperAdmin
    ? []
    : [Role.SuperAdmin, Role.ProgramAdmin, Role.Researcher];

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { userId } = useParams();
  let updating = userId !== undefined;
  const fillTaskRef = useRef(false);

  const { register, handleSubmit, setValue, control } = useForm();
  const [uploading, setUploading] = useState(false);
  const selectedRole = useWatch({
    control,
    name: "role",
    defaultValue: Role.SuperAdmin
  });
  /*
  let askForProgramAdmin = [
    Role.ProgramAdmin,
    Role.Student,
    Role.Teacher,
    Role.Researcher,
    Role.Coach,
  ].includes(selectedRole);
   */
  let askForProgramAdmin = selectedRole !== Role.SuperAdmin;

  let {
    data: user,
    isSuccess,
    isLoading
  } = useGetUser(userId, {
    keepPreviousData: true,
    enabled: updating
  });

  const { data: programs } = useGetPrograms({
    initialData: [],
    keepPreviousData: true
  });

  let backedUserAvailable = updating && isSuccess;

  useAutoFillEffect(
    backedUserAvailable && !fillTaskRef.current,
    () => {
      fillTaskRef.current = true;
      setValue("role", user.role);
      setValue("email", user.email);
      setValue("first_name", user.first_name);
      setValue("last_name", user.last_name);
      setValue("location", user.location ?? "");
      setValue("phone", user.phone ?? "");
      setValue("guard_name", user.guard_name ?? "");
      setValue("guard_rel", user.guard_rel ?? "");
      setValue("guard_email", user.guard_email ?? "");
      setValue("guard_phone", user.guard_phone ?? "");
      if (user.program_id) setValue("program_id", user.program_id);
      console.log("Autofilled");
    },
    [userId, askForProgramAdmin]
  );

  const onSubmit: SubmitHandler<any> = useCallback(
    async data => {
      setUploading(true);
      try {
        let password = data.password || "";
        password = password.toString().trim();
        password = password.length === 0 ? null : password;

        let program_id: any = null;
        if (askForProgramAdmin) {
          program_id = isSuperAdmin ? data.program_id : currentUser.program.id;
          if (!program_id) return alert("Please select a program");
        }
        console.log(askForProgramAdmin, program_id);

        let server_data = {
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          role: data.role,
          program_id: program_id,
          location: data.location ?? "",
          phone: data.phone ?? "",
          guard_name: data.guard_name ?? "",
          guard_rel: data.guard_rel ?? "",
          guard_email: data.guard_email ?? "",
          guard_phone: data.guard_phone ?? "",
          password
        };

        if (
          !(
            server_data.email &&
            server_data.first_name &&
            server_data.last_name &&
            server_data.role &&
            (updating || password)
          )
        )
          return alert("Please fill all the required fields");

        // console.log(server_data);

        let url = updating ? `/users/update/${userId}` : "/users/create";
        let resp = await apiConn.post(url, server_data);

        if (resp.data.status === "success") {
          if (updating) {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["user", userId] });
          }
          navigate(-1);
        } else {
          alert("An error occured");
          console.log(resp.data);
        }
      } finally {
        setUploading(false);
      }
    },
    [userId, isSuperAdmin, currentUser, askForProgramAdmin]
  );

  if (updating && isLoading)
    //
    return <ExpandedSpinner />;

  let viewTitle = updating ? "Edit User" : "Add New User";
  let btnText = updating ? "Save" : "Add User";

  return (
    <section className='mt-8'>
      <BackArrowButton />

      <h4 className='mb-6 text-4xl font-bold'>{viewTitle}</h4>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col items-start'>
          <label className='mb-3 pl-1 text-lg font-semibold'>Select Role</label>
          <div className='floating-select'>
            <select disabled={updating} {...register("role")}>
              {iterRoles(excludeAvailableRole).map(({ role, name }) => (
                <option key={role} value={role}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <section className='mt-12 grid grid-cols-1 gap-x-9 gap-y-6 lg:grid-cols-2'>
          <div className='floating-input'>
            <input {...register("email")} placeholder=' ' size={1} />
            <label>Email</label>
          </div>
          <div className='floating-input'>
            <input
              {...register("password")}
              placeholder=' '
              size={1}
              type='password'
            />
            <label>Password</label>
          </div>
          <div className='floating-input'>
            <input {...register("first_name")} placeholder=' ' size={1} />
            <label>First Name</label>
          </div>
          <div className='floating-input'>
            <input {...register("last_name")} placeholder=' ' size={1} />
            <label>Last Name</label>
          </div>
        </section>

        <h2 className='my-6 text-lg font-bold'>Personal Information</h2>
        <section className='grid grid-cols-1 gap-x-9 gap-y-6 lg:grid-cols-2'>
          <div className='floating-input'>
            <input {...register("location")} placeholder=' ' size={1} />
            <label>Location</label>
          </div>
          <div className='floating-input'>
            <input {...register("phone")} placeholder=' ' size={1} />
            <label>Phone Number</label>
          </div>
        </section>

        {[Role.Student, Role.Coach].includes(selectedRole) && (
          <>
            <h2 className='mb-6 mt-10 text-lg font-bold'>
              Guardian Information
            </h2>
            <section className='grid grid-cols-1 gap-x-9 gap-y-6 lg:grid-cols-2'>
              <div className='floating-input'>
                <input {...register("guard_name")} placeholder=' ' size={1} />
                <label>Gaurdian's Name</label>
              </div>
              <div className='floating-input'>
                <input {...register("guard_rel")} placeholder=' ' size={1} />
                <label>Gaurdian's Relation</label>
              </div>
              <div className='floating-input'>
                <input {...register("guard_email")} placeholder=' ' size={1} />
                <label>Email Address</label>
              </div>
              <div className='floating-input'>
                <input {...register("guard_phone")} placeholder=' ' size={1} />
                <label>Phone Number</label>
              </div>
            </section>
          </>
        )}

        {askForProgramAdmin && isSuperAdmin && (
          <div className='mt-8 flex flex-col items-start'>
            <label className='mb-3 pl-1 text-lg font-semibold'>
              Program Assigned
            </label>
            <div className='floating-select'>
              <select disabled={updating} {...register("program_id")}>
                {programs.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className='mt-8 flex gap-x-4'>
          <Link to='..' className='w-button w-button-outline'>
            Cancel
          </Link>
          <button disabled={uploading} type='submit' className='w-button'>
            {uploading ? <Ellipsis size={20} /> : btnText}
          </button>
        </div>
      </form>
    </section>
  );
}
