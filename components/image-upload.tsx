"use client";

import { storage } from "@/lib/firebase";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PuffLoader } from "react-spinners";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload = ({
  disabled,
  onChange,
  onRemove,
  value,
}: ImageUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onUpload = async (e: any) => {
    const file = e.target.files[0];
    setIsLoading(true);

    const uploadTask = uploadBytesResumable(
      ref(storage, `images/Pictures/${Date.now()}-${file.name}`),
      file,
      { contentType: file.type }
    );

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);  // Update progress state
      },
      (error) => {
        toast.error(error.message);
        setIsLoading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          onChange(downloadURL);
          setIsLoading(false);
        });
      }
    );
  };

  const onDelete = (url: string) => {
    onRemove(url);
    deleteObject(ref(storage, url)).then(() => {
      toast.success("Image Removed successfully");
    }).catch((error) => {
      toast.error(error.message);
    });
  };

  return (
    <>
      {value && value.length > 0 ? (
        <div className="mb-4 flex items-center gap-4">
          {value.map(url => (
            <div className="relative w-52 h-52 rounded-md overflow-hidden" key={url}>
              <Image
                fill
                className="object-cover"
                src={url}
                alt="Billboard Image"
              />
              <div className="absolute z10 top-2 right-2">
                <Button type="button" onClick={() => onDelete(url)} variant={"destructive"} size="icon">
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-52 h-52 rounded-md overflow-hidden border border-dashed border-gray-200 flex items-center justify-center flex-col gap-3">
          {isLoading ? (
            <>
              <PuffLoader size={30} color={"#555"} />
              <p>{`${progress.toFixed(2)}%`}</p>  {/* Display progress */}
            </>
          ) : (
            <>
              <label>
                <div className="w-full h-full flex flex-col gap-2 items-center justify-center cursor-pointer">
                  <ImagePlus className="h-4 w-4" />
                  <p>Upload an image</p>
                </div>
                <input
                  type="file"
                  onChange={onUpload}
                  accept="image/*"
                  className="w-0 h-0"
                />
              </label>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ImageUpload;
