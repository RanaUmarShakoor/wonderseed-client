import { Dialog } from "@headlessui/react";

import { useDropzone } from "react-dropzone";
import { ImageDropBlock } from "components/ImageDropBlock";

import {
  FileResourceHandle,
  ParamVoidCallback,
  VoidCallback,
  uploadFile,
  useAutoFillEffect,
  useMediaUpload
} from "utils";
import { useRef, useState } from "react";
import { apiConn, useGetUser } from "apiconn";
import { ExpandedSpinner } from "./Spinner";
import { useAppStoreKey } from "stores/main";
import { useQueryClient } from "@tanstack/react-query";
import { Ellipsis } from "react-css-spinners";

export function ProfilePictureModal({
  modalOpen,
  setModalOpen
}: {
  modalOpen?: boolean;
  setModalOpen?: ParamVoidCallback<boolean>;
}) {
  return (
    <Dialog open={!!modalOpen} onClose={() => {}}>
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div
        className='fixed inset-0 bg-black/30 backdrop-blur-md'
        aria-hidden='true'
      />

      <div className='fixed inset-0 overflow-y-auto'>
        {/* Full-screen container to center the panel */}
        <div className='flex min-h-full items-center justify-center p-4'>
          {/* The actual dialog panel  */}
          <Dialog.Panel
            id='th-msgs-modal'
            className='mx-auto w-[90vw] max-w-[450px] rounded-2xl bg-white px-10 pb-9 pt-4'
          >
            <Dialog.Title className='-mx-6 flex justify-end'>
              <img
                onClick={() => setModalOpen?.(false)}
                src={"/cross.svg"}
                className='box-content h-7 w-7 cursor-pointer rounded-lg p-2 transition-colors hover:bg-black/10'
              />
            </Dialog.Title>
            <ProfilePictureModalMain onUpdated={() => setModalOpen?.(false)} />
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}

function ProfilePictureModalMain({ onUpdated }: { onUpdated: VoidCallback }) {
  const queryClient = useQueryClient();
  const auth = useAppStoreKey("auth");

  const [uploading, setUploading] = useState(false);

  const {
    data: user,
    isLoading,
    isSuccess: userLoaded
  } = useGetUser(auth.user.id);

  const {
    file,
    preview,
    onDrop,
    hydrateWith,
    hyrdationState,
    mode,
    reset
  } = useMediaUpload();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"]
    }
  });

  const fillTaskRef = useRef(false);

  useAutoFillEffect(
    userLoaded && !fillTaskRef.current,
    () => {
      fillTaskRef.current = true;
      if (user.pfp) hydrateWith(user.pfp);
    },
    [user]
  );

  async function handleSave() {
    setUploading(true);
    try {
      let handle: FileResourceHandle | null = null;
      if (mode === "local") {
        if (file !== null) handle = await uploadFile(file, "user-pfp");
      } else {
        handle = hyrdationState!;
      }

      let resp = await apiConn.post(`/users/update-pfp/${user.id}`, {
        pfp: handle?.id ?? null
      });

      if (resp.data.status === "success") {
        queryClient.invalidateQueries({ queryKey: ["user", user.id] });
        console.log("Picture Updated");
        onUpdated();
      } else {
        alert("An error occured");
        console.log(resp.data);
      }
    } finally {
      setUploading(false);
    }
  }

  if (isLoading)
    //
    return <ExpandedSpinner />;

  return (
    <div className='flex flex-col items-center'>
      <ImageDropBlock
        className='inline-block'
        label='Upload Profile Picture'
        rootProps={getRootProps()}
        inputProps={getInputProps()}
        isDragActive={isDragActive}
        preview={preview}
        helper={
          <>
            <p>Recommended Aspect Ratio: 1:1</p>
            <p>Recommended Size: 200x200px</p>
          </>
        }
      />
      <div className='flex items-center gap-x-4'>
        <button
          className='w-button mt-6'
          onClick={() => {
            reset();
            // setMode("local");
            // setFile(null);
          }}
        >
          Remove
        </button>
        <button
          disabled={uploading}
          className='w-button mt-6'
          onClick={handleSave}
        >
          {uploading ? <Ellipsis size={20} /> : "Save"}
        </button>
      </div>
    </div>
  );
}
