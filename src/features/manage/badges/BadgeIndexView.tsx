import cx from "classnames";
import { useDropzone } from "react-dropzone";
import {
  FileResourceHandle,
  toNumOrNull,
  uploadFile,
  useMediaUpload
} from "utils";
import { useCallback, useEffect, useState } from "react";
import { BadgeType } from "badge-types";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { apiConn, resolveUploadUrl, useGetBadge } from "apiconn";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { ExpandedSpinner } from "components/Spinner";
import { BackArrowButton } from "components/BackArrowButton";
import { ImageDropBlock } from "components/ImageDropBlock";
import { Ellipsis } from "react-css-spinners";

export function BadgeIndexView() {
  const { badgeId } = useParams();
  let updating = badgeId !== undefined;

  let {
    data: badge,
    isLoading,
    isSuccess
  } = useGetBadge(badgeId, {
    enabled: updating
  });

  useEffect(() => {
    if (!updating)
      //
      return;

    if (badge == undefined || !isSuccess) return;

    if (badge.image) hydrateWith(badge.image);
    setValue("name", badge.name);
    setValue("btype", badge.btype);
    setValue("streak_days", badge.streak_days ?? "");
  }, [badge, isSuccess]);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { file, preview, onDrop, hydrateWith, hyrdationState, mode } =
    useMediaUpload();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"]
    }
  });

  const { register, handleSubmit, setValue, control } = useForm();
  const [uploading, setUploading] = useState(false);

  const selectedType = useWatch({
    control,
    name: "btype"
  }) as BadgeType;

  const onSubmit: SubmitHandler<any> = useCallback(
    async data => {
      setUploading(true);
      try {
        let handle: FileResourceHandle;
        if (mode === "local") {
          if (file === null) return alert("Image missing");

          handle = await uploadFile(file, "create-badge");
        } else {
          handle = hyrdationState!;
        }

        let server_data = {
          name: data.name,
          btype: data.btype,
          streak_days: toNumOrNull(data.streak_days),
          image: handle.id
        };

        if (
          !(
            server_data.name &&
            server_data.btype &&
            (server_data.btype !== BadgeType.Streak ||
              +server_data.streak_days! > 0) &&
            1
          )
        )
          return alert("Please fill all the fields");

        // console.log(server_data);
        // return;

        let url = updating ? `/badge/update/${badgeId}` : `/badge/create`;

        let resp = await apiConn.post(url, server_data);

        if (resp.data.status === "success") {
          if (updating) {
            queryClient.invalidateQueries({ queryKey: ["badges"] });
            queryClient.invalidateQueries({ queryKey: ["badge", badgeId] });
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
    [badgeId, mode, file, hyrdationState]
  );

  if (updating && isLoading) return <ExpandedSpinner />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='mt-8'>
      <BackArrowButton />
      <h4 className='mb-8 text-4xl font-bold'>Add Badge</h4>

      <div className='mb-4 max-w-lg'>
        <div className='floating-input'>
          <input {...register("name")} placeholder=' ' size={1} />
          <label>Name</label>
        </div>
      </div>

      <ImageDropBlock
        label='Image'
        rootProps={getRootProps()}
        inputProps={getInputProps()}
        isDragActive={isDragActive}
        preview={preview}
        helper={`*Recommended Aspect Ratio: 1:1, Recommended Size: 600x600px`}
      />

      <div className='mt-4 flex flex-col items-start'>
        <label className='mb-3 pl-1 text-lg font-semibold'>Type</label>
        <div className='floating-select'>
          <select {...register("btype")}>
            <option value={BadgeType.Superhero}>Superhero Badge</option>
            <option value={BadgeType.Streak}>Streak Badge</option>
            <option value={BadgeType.Achievement}>Achievement Badge</option>
          </select>
        </div>
      </div>

      {selectedType === BadgeType.Streak && (
        <div className='mt-4 max-w-lg'>
          <div className='floating-input'>
            <input {...register("streak_days")} placeholder=' ' size={1} />
            <label>Streak Days</label>
          </div>
        </div>
      )}

      <button disabled={uploading} className='w-button mt-4'>
        {uploading ? <Ellipsis size={20} /> : "Save"}
      </button>
    </form>
  );
}
