import { useRef } from "react";
import { RenderableElement } from "../DayDesignBase";
import {
  FileUploadCollection,
  FileUploadElement,
  fileUploadSkip,
  fileUploadTransform
} from "./FileUploadElement";

export const VideoElement: RenderableElement<FileUploadCollection> = {
  id: "video",
  name: "Video",
  preview: (
    <img
      src='/place-video.png'
      className='h-28 w-full border border-green-2/50 object-cover object-center'
    />
  ),
  Master: ({ instance }) => {
    const videoElemRef = useRef<HTMLVideoElement>(null);

    return (
      <FileUploadElement
        instance={instance}
        title='Drop here or click to upload video'
        subtitle='Allowed types: MP4'
        dropzoneOpts={{
          accept: {
            "video/*": [".mp4"]
          }
        }}
        afterUpload={() => {
          videoElemRef.current && videoElemRef.current.load();
        }}
        generatePreview={source => (
          <video
            controls
            crossOrigin=''
            playsInline
            ref={videoElemRef}
            onLoad={() => URL.revokeObjectURL(source)}
            className='mx-auto mt-2 max-w-[50%]'
          >
            <source src={source} type='video/mp4' />
          </video>
        )}
      />
    );
  },
  transform: fileUploadTransform,
  skip: fileUploadSkip
};
