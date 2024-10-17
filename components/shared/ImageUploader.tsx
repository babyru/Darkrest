import { Upload } from "lucide-react";
import React, { ChangeEvent } from "react";

interface ImageUploaderPops {
  imageUrl: string | null;
  handleImageUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  label: string;
}

const ImageUploader = ({
  imageUrl,
  handleImageUpload,
  className,
  label,
}: ImageUploaderPops) => {
  return (
    <>
      <input
        type="file"
        accept="image/*"
        id={label}
        className="hidden"
        onChange={handleImageUpload}
      />
      <label
        htmlFor={label}
        className={`relative m-auto ${className ? className : "h-[600px] max-w-lg rounded-xl"} flex cursor-pointer flex-col items-center justify-center overflow-hidden border-2 border-dashed border-icon bg-button shadow-inner`}
      >
        {imageUrl && (
          <>
            <img
              src={imageUrl}
              alt="image"
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-0 left-0 flex h-full w-full items-center justify-center bg-icon/45 text-xl font-semibold text-white opacity-0 backdrop-blur-sm transition-all duration-300 hover:opacity-100">
              Change Picture
            </div>
          </>
        )}

        {!imageUrl && (
          <>
            <Upload className="h-10 w-10 text-icon" />
            <p className="text-sm font-semibold text-icon">Upload Image</p>
          </>
        )}

        {/* image link upload 👇. for now disabled */}
        <>
          {/* <hr className="my-5 border border-icon" />
        <label
          htmlFor="image-url"
          className="text-sm font-semibold text-myForeground"
        >
          (Optional) Enter a valid image URL
        </label>
        <input
          type="url"
          id="image-url"
          placeholder="Image URL"
          className="input-style mt-1 text-myForeground/45 focus:text-myForeground"
          value={image ? (image as string) : ""}
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            setImage(e.target.value)
          }
        /> */}
        </>
      </label>
    </>
  );
};

export default ImageUploader;
