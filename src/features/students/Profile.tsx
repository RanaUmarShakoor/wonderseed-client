import { Link } from "react-router-dom";
import { TopNav } from "./TopNav";
import { SideView } from "components/SideView/SideView";
import ProfileAvatar from "assets/profile-avatar.png";
import { SidebarLogoutButton } from "components/SideView/SidebarLogoutButton";
import { apiConn, useGetUser } from "apiconn";
import { useAppStoreKey } from "stores/main";
import { ExpandedSpinner } from "components/Spinner";
import { SubmitHandler, useForm } from "react-hook-form";
import { ReactNode, useCallback, useRef, useState } from "react";
import { resolveUserPfp, useAutoFillEffect } from "utils";
import { useQueryClient } from "@tanstack/react-query";
import { ProfilePictureModal } from "components/ProfilePictureChanger";

function Sidebar({ inputs, student }: { inputs?: ReactNode; student: any }) {
  const [pfpModelOpen, setPfpModelOpen] = useState(false);

  return (
    <SideView>
      <div>
        <Link
          to='/'
          className='mb-14 h-28 w-28 shrink-0 self-start overflow-hidden rounded-full'
        >
          <img src='/logo-name.png' className='h-full w-full' />
        </Link>

        <div className='h-16 w-16 shrink-0'>
          <img
            onClick={() => setPfpModelOpen(true)}
            className='cursor-pointer'
            src={resolveUserPfp(student)}
          />
        </div>

        {/* <p className='mt-2 text-base'>Student ID: WS_S_786</p> */}
        <p className='mt-2 text-base'>Student ID: {student.app_id}</p>

        <h2 className='mt-10 text-lg font-bold'>Security Infomation</h2>

        <div className='mt-9 space-y-6 self-stretch'>{inputs}</div>
        <s className='grow' />
        <SidebarLogoutButton />
      </div>
      <ProfilePictureModal
        modalOpen={pfpModelOpen}
        setModalOpen={setPfpModelOpen}
      />
    </SideView>
  );
}

export function Profile() {
  const auth = useAppStoreKey("auth");
  const queryClient = useQueryClient();
  const {
    data: student,
    isLoading,
    isSuccess: userLoaded
  } = useGetUser(auth.user.id);
  const fillTaskRef = useRef(false);

  const { register, handleSubmit, setValue } = useForm();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useAutoFillEffect(
    userLoaded && !fillTaskRef.current,
    () => {
      fillTaskRef.current = true;
      setValue("first_name", student.first_name ?? "");
      setValue("last_name", student.last_name ?? "");
      setValue("location", student.location ?? "");
      setValue("phone", student.phone ?? "");
      setValue("guard_name", student.guard_name ?? "");
      setValue("guard_rel", student.guard_rel ?? "");
      setValue("guard_email", student.guard_email ?? "");
      setValue("guard_phone", student.guard_phone ?? "");
      setEmail(student.email);
      console.log("Autofilled");
    },
    [student]
  );

  const onSubmit: SubmitHandler<any> = useCallback(
    async data => {
      let passwordN: string | null = password.toString().trim();
      passwordN = passwordN.length === 0 ? null : passwordN;
      let server_data = {
        first_name: data.first_name,
        last_name: data.last_name,
        location: data.location,
        phone: data.phone,
        guard_name: data.guard_name,
        guard_rel: data.guard_rel,
        guard_email: data.guard_email,
        guard_phone: data.guard_phone,
        email: email,
        password: passwordN
      };
      let resp = await apiConn.post(`/users/update/${student.id}`, server_data);
      if (resp.data.status === "success") {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        queryClient.invalidateQueries({ queryKey: ["user", student.id] });
        setPassword("");
        alert("Updated");
      } else {
        alert("An error occured");
        console.log(resp.data);
      }
    },
    [student, email, password]
  );

  if (isLoading)
    //
    return <ExpandedSpinner flex />;

  return (
    <>
      <Sidebar
        student={student}
        inputs={
          <>
            <div className='floating-input'>
              <input
                placeholder=' '
                value={email}
                onChange={event => setEmail(event.currentTarget.value)}
                size={1}
              />
              <label>Email</label>
            </div>
            <div className='floating-input'>
              <input
                placeholder=' '
                size={1}
                type='password'
                value={password}
                onChange={event => setPassword(event.currentTarget.value)}
              />
              <label>Password</label>
            </div>
          </>
        }
      />
      <div className='sideview-content-sheet'>
        <TopNav />
        <div className='sideview-content'>
          <h1 className='my-10 text-4xl font-bold'>
            Hi Learner, Update Your Profile
          </h1>

          <form onSubmit={handleSubmit(onSubmit)}>
          <h2 className='mb-6 text-lg font-bold'>Personal Information</h2>
            <section className='grid grid-cols-1 gap-x-9 gap-y-6 lg:grid-cols-2'>
              <div className='floating-input'>
                <input
                  {...register("first_name")}
                  placeholder=' '
                  defaultValue='Jeniffer'
                  size={1}
                />
                <label>First Name</label>
              </div>
              <div className='floating-input'>
                <input {...register("last_name")} placeholder=' ' size={1} />
                <label>Last Name</label>
              </div>
              <div className='floating-input'>
                <input {...register("location")} placeholder=' ' size={1} />
                <label>Location</label>
              </div>
              <div className='floating-input'>
                <input {...register("phone")} placeholder=' ' size={1} />
                <label>Phone Number</label>
              </div>
            </section>
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

            <button type='submit' className='w-button mt-10 w-full md:w-auto'>
              Update
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
