import { RenderableElement } from "../DayDesignBase";
import {
  FileUploadCollection,
  FileUploadElement,
  fileUploadSkip,
  fileUploadTransform
} from "./FileUploadElement";

export const ImageElement: RenderableElement<FileUploadCollection> = {
  id: "image",
  name: "Image",
  preview: (
    <img
      src='/place-image.png'
      className='h-28 w-full border border-green-2/50 object-cover object-center'
    />
  ),
  Master: ({ instance }) => {
    return (
      <FileUploadElement
        instance={instance}
        title='Drop here or click to upload image'
        subtitle='Allowed types: PNG, JPG, JPEG'
        dropzoneOpts={{
          accept: {
            "image/*": [".png", ".jpg", ".jpeg"]
          }
        }}
        generatePreview={source => (
          <img
            src={source}
            className='mx-auto mt-2 max-w-[50%]'
            alt='Img'
            onLoad={() => URL.revokeObjectURL(source)}
          />
        )}
      />
    );
  },
  transform: fileUploadTransform,
  skip: fileUploadSkip
};
