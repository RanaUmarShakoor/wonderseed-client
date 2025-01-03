import { useQueryClient } from "@tanstack/react-query";
import { apiConn, resolveUploadUrl, useGetUser } from "apiconn";
import ProfileAvatar from "assets/profile-avatar.png";
import { ProfilePictureModal } from "components/ProfilePictureChanger";
import { ExpandedSpinner } from "components/Spinner";
import { useCallback, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppStoreKey } from "stores/main";
import { resolveUserPfp, useAutoFillEffect } from "utils";

export function TeacherProfile() {
  const [pfpModelOpen, setPfpModelOpen] = useState(false);

  const auth = useAppStoreKey("auth");
  const queryClient = useQueryClient();
  const {
    data: teacher,
    isLoading,
    isSuccess: userLoaded
  } = useGetUser(auth.user.id);
  const fillTaskRef = useRef(false);

  const { register, handleSubmit, setValue } = useForm();

  useAutoFillEffect(
    userLoaded && !fillTaskRef.current,
    () => {
      fillTaskRef.current = true;
      setValue("first_name", teacher.first_name ?? "");
      setValue("last_name", teacher.last_name ?? "");
      setValue("email", teacher.email ?? "");
      setValue("phone", teacher.phone ?? "");
      // password
      setValue("location", teacher.location ?? "");
      console.log("Autofilled");
    },
    [teacher]
  );

  const onSubmit: SubmitHandler<any> = useCallback(
    async data => {
      let password: string = data.password || "";
      let passwordN: string | null = password.toString().trim();
      passwordN = passwordN.length === 0 ? null : passwordN;
      let server_data = {
        first_name: data.first_name,
        last_name: data.last_name,
        location: data.location,
        phone: data.phone,
        email: data.email,
        password: passwordN
      };
      let resp = await apiConn.post(`/users/update/${teacher.id}`, server_data);
      if (resp.data.status === "success") {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        queryClient.invalidateQueries({ queryKey: ["user", teacher.id] });
        setValue("password", "");
        alert("Updated");
      } else {
        alert("An error occured");
        console.log(resp.data);
      }
    },
    [teacher]
  );

  if (isLoading)
    //
    return <ExpandedSpinner flex />;

  return (
    <div className='sideview-content'>
      <section className='mt-14 flex items-center gap-x-3'>
        <div className='h-28 w-28 shrink-0'>
          <img
            onClick={() => setPfpModelOpen(true)}
            className='cursor-pointer'
            src={resolveUserPfp(teacher)}
          />
        </div>
        <div>
          <h4 className='text-lg font-bold'>Hello, {teacher?.first_name}</h4>
          <p className='text-lg'>Facilitator ID: {teacher?.app_id}</p>
        </div>
      </section>

      <form onSubmit={handleSubmit(onSubmit)}>
        <section className='mt-16 grid grid-cols-1 gap-x-9 gap-y-6 lg:grid-cols-2'>
          <div className='floating-input'>
            <input {...register("first_name")} placeholder=' ' size={1} />
            <label>First Name</label>
          </div>
          <div className='floating-input'>
            <input {...register("last_name")} placeholder=' ' size={1} />
            <label>Last Name</label>
          </div>
          <div className='floating-input'>
            <input {...register("email")} placeholder=' ' size={1} />
            <label>Email</label>
          </div>
          <div className='floating-input'>
            <input {...register("phone")} placeholder=' ' size={1} />
            <label>Phone Number</label>
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
            <input {...register("location")} placeholder=' ' size={1} />
            <label>Location</label>
          </div>
        </section>

        <button type='submit' className='w-button mt-10 self-start'>
          Update
        </button>
      </form>
      <ProfilePictureModal
        modalOpen={pfpModelOpen}
        setModalOpen={setPfpModelOpen}
      />
    </div>
  );
}
