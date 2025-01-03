import { useQueryClient } from "@tanstack/react-query";
import { apiConn, useGetDay, useGetModule } from "apiconn";
import { BackArrowButton } from "components/BackArrowButton";
import { ImageDropBlock } from "components/ImageDropBlock";
import { ExpandedSpinner } from "components/Spinner";
import { useCallback, useEffect, useState } from "react";
import { Ellipsis } from "react-css-spinners";
import { useDropzone } from "react-dropzone";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FileResourceHandle, uploadFile, useMediaUpload } from "utils";

export function DayIndexView() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue } = useForm();
  const [uploading, setUploading] = useState(false);

  let { dayId, moduleId } = useParams();
  let updating = dayId !== undefined;

  const { data: day, isSuccess: dayLoaded } = useGetDay(dayId, {
    enabled: updating
  });
  let backedDayAvailable = updating && dayLoaded;
  useEffect(() => {
    if (!backedDayAvailable)
      //
      return;

    console.log(day);

    setValue("name", day.name);
    setValue("purpose", day.purpose);
    setValue("super_power", day.super_power);
    setValue("description", day.description);
    if (day.character) hydrateWith(day.character);
  }, [moduleId, dayLoaded]);

  if (backedDayAvailable)
    //
    moduleId = day.module_id;

  const { data: module_, isSuccess: moduleLoaded } = useGetModule(moduleId, {
    enabled: moduleId !== undefined,
    includeParentProgram: true
  });

  /* =============== Character Image =============== */

  const { file, preview, onDrop, hydrateWith, hyrdationState, mode } =
    useMediaUpload();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"]
    }
  });

  // {... snip ...}
  const onSubmit: SubmitHandler<any> = useCallback(
    async data => {
      setUploading(true);
      try {
        let handle: FileResourceHandle;
        if (mode === "local") {
          if (file === null) return alert("Image missing");

          handle = await uploadFile(file, "day-character");
        } else {
          handle = hyrdationState!;
        }

        let server_data = {
          name: data.name,
          purpose: data.purpose,
          super_power: data.super_power,
          description: data.description,
          serial_num: +data.serial_num,
          character: handle.id
        };

        if (
          !(
            server_data.name &&
            server_data.super_power &&
            server_data.description &&
            server_data.purpose &&
            1
          )
        )
          return alert("Please fill all the fields");

        let url = updating
          ? `/days/update/${dayId}`
          : `/days/create/${moduleId}`;

        let resp = await apiConn.post(url, server_data);

        if (resp.data.status === "success") {
          if (updating)
            queryClient.invalidateQueries({ queryKey: ["day", dayId] });

          navigate(-1);
        } else {
          alert("An error occured");
          console.log(resp.data);
        }
      } finally {
        setUploading(false);
      }
    },
    [dayId, mode, file, hyrdationState]
  );

  /* =============== Other =============== */

  let serialNum = null;
  if (moduleLoaded && (!updating || dayLoaded)) {
    //
    serialNum = updating ? day.serial_num : module_.days.length + 1;
  } else {
    //
    return <ExpandedSpinner />;
  }

  return (
    <section className='mt-8'>
      <BackArrowButton />

      <header className='mb-8 flex items-start gap-x-4'>
        <div className='rounded-lg border bg-green-600/20 px-3 py-2'>
          <p className='text-sm text-black/50'>Program</p>
          <p className='mr-4 text-lg font-bold'>
            {moduleLoaded && module_.program.name}
          </p>
        </div>
        <div className='rounded-lg border bg-indigo-600/20 px-3 py-2'>
          <p className='text-sm text-black/50'>Module Number</p>
          <p className='mr-4 text-lg font-bold'>
            {moduleLoaded && module_.serial_num}
          </p>
        </div>
        <div className='rounded-lg border bg-blue-600/20 px-3 py-2'>
          <p className='text-sm text-black/50'>Day Number</p>
          <p className='mr-4 text-lg font-bold'>{serialNum}</p>
        </div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type='hidden'
          {...register("serial_num")}
          value={serialNum || ""}
        />
        <div className='max-w-lg space-y-4'>
          <div className='floating-input'>
            <input {...register("name")} placeholder=' ' size={1} />
            <label>Day Name</label>
          </div>
          <div className='floating-input'>
            <input {...register("purpose")} placeholder=' ' size={1} />
            <label>Day Purpose</label>
          </div>
          <div className='floating-input'>
            <input {...register("super_power")} placeholder=' ' size={1} />
            <label>Day Super Power</label>
          </div>
          <div className='floating-input'>
            <input {...register("description")} placeholder=' ' size={1} />
            <label>Day Description</label>
          </div>
        </div>

        <ImageDropBlock
          label='Assign Character To Defeat'
          rootProps={getRootProps()}
          inputProps={getInputProps()}
          isDragActive={isDragActive}
          preview={preview}
          helper={`*Recommended Aspect Ratio: 1:2, Recommended Size: 200x400px`}
        />

        <button disabled={uploading} type='submit' className='w-button mt-8'>
          {uploading ? <Ellipsis size={20} /> : "Save"}
        </button>
      </form>

      {updating && (
        <footer className='mt-8 flex gap-x-4'>
          <Link to={`../day/${dayId}/edit/content`} className='w-button'>
            Design Day Content
          </Link>
          <Link to={`../day/${dayId}/edit/assessment`} className='w-button'>
            Design Day Assessment
          </Link>
        </footer>
      )}
    </section>
  );
}
