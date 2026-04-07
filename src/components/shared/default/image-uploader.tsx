import "react-image-crop/dist/ReactCrop.css";

import { Crop as CropIcon, RefreshCw,Upload, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { type Accept,useDropzone } from "react-dropzone";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  type Crop,
  makeAspectCrop,
  type PixelCrop,
} from "react-image-crop";

import { Button } from "@/components/ui/button";
import { cn, generateRandomFileName } from "@/lib/utils";

interface ImageUploaderProps {
  onFileChange: (file: File | null) => void;
  imageStyles?: string;
  initialFileUrl?: string;
  acceptedFileTypes?: Accept;
  enableImageCropping?: boolean;
  cropAspectRatio?: number;
  className?: string;
  containerClassName?: string;
  dropzoneClassName?: string;
  imageClassName?: string;
  imageContainerClassName?: string;
  quality?: number;
}

async function getCroppedImg(
  image: HTMLImageElement,
  pixelCrop: PixelCrop,
  fileName: string,
  quality: number = 0.8,
): Promise<File> {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  // Round dimensions to prevent sub-pixel issues
  canvas.width = Math.floor(pixelCrop.width * scaleX);
  canvas.height = Math.floor(pixelCrop.height * scaleY);

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  // Ensure high quality scaling
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    image,
    pixelCrop.x * scaleX,
    pixelCrop.y * scaleY,
    pixelCrop.width * scaleX,
    pixelCrop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        const file = new File([blob], fileName, { type: "image/jpeg" });
        resolve(file);
      },
      "image/jpeg",
      quality,
    );
  });
}

const ImageUploader = ({
  onFileChange,
  imageStyles = "overflow-hidden shadow-md",
  initialFileUrl = "",
  acceptedFileTypes = { "image/*": [] },
  enableImageCropping = true,
  cropAspectRatio = 1,
  className,
  containerClassName,
  dropzoneClassName,
  imageClassName,
  imageContainerClassName,
  quality = 0.8,
}: ImageUploaderProps) => {
  const [fileUrl, setFileUrl] = useState<string>(initialFileUrl);
  const [cropping, setCropping] = useState<boolean>(false);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (initialFileUrl) {
      setFileUrl(initialFileUrl);
    }
  }, [initialFileUrl]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const newFileUrl = URL.createObjectURL(file);
        setFileUrl(newFileUrl);
        if (enableImageCropping && file.type.startsWith("image/")) {
          setCropping(true);
        } else {
          onFileChange(file);
        }
      }
    },
    [enableImageCropping, onFileChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    multiple: false,
  });

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const initialCrop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        cropAspectRatio,
        width,
        height,
      ),
      width,
      height,
    );
    setCrop(initialCrop);
    setCompletedCrop(convertToPixelCrop(initialCrop, width, height));
  }

  const handleSaveCrop = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (imgRef.current && completedCrop) {
      try {
        const croppedFile = await getCroppedImg(
          imgRef.current,
          completedCrop,
          generateRandomFileName(),
          quality,
        );
        const croppedUrl = URL.createObjectURL(croppedFile);
        setFileUrl(croppedUrl);
        setCropping(false);
        onFileChange(croppedFile);
      } catch (error) {
        console.error("Error cropping image:", error);
      }
    }
  };

  const cancelCrop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFileUrl("");
    setCropping(false);
    onFileChange(null);
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFileUrl("");
    onFileChange(null);
  };

  return (
    <div className={cn("w-full max-w-full mx-auto overflow-hidden", className)}>
      {cropping ? (
        <div
          className={cn(
            "flex flex-col items-center gap-4 p-4 sm:p-6 bg-background rounded-xl border border-border shadow-lg",
            containerClassName,
          )}
        >
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CropIcon className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Crop Image</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={cancelCrop}
              className="rounded-full h-8 w-8"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="relative w-full overflow-hidden rounded-lg bg-muted flex items-center justify-center border border-border/50">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={cropAspectRatio}
              className="max-h-[50vh] sm:max-h-[60vh]"
            >
              <img
                ref={imgRef}
                src={fileUrl}
                alt="Crop preview"
                onLoad={onImageLoad}
                className="max-w-full max-h-[50vh] sm:max-h-[60vh] w-auto h-auto object-contain"
              />
            </ReactCrop>
          </div>

          <div className="flex w-full gap-3 mt-2">
            <Button
              variant="outline"
              onClick={cancelCrop}
              className="flex-1 rounded-lg"
            >
              Cancel
            </Button>
            <Button onClick={handleSaveCrop} className="flex-1 rounded-lg">
              Apply
            </Button>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "relative flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-4 transition-colors cursor-pointer min-h-[160px]",
            isDragActive && "border-primary bg-primary/5",
            fileUrl && "border-solid",
            dropzoneClassName,
          )}
        >
          <input {...getInputProps()} />

          {fileUrl ? (
            <div
              className={cn(
                "relative w-full h-full flex flex-col items-center justify-center gap-3 overflow-hidden",
                imageContainerClassName,
              )}
            >
              <div className={cn("relative group shrink-0", imageStyles)}>
                <img
                  src={fileUrl}
                  alt="Preview"
                  className={cn(
                    "max-h-[140px] sm:max-h-[200px] w-auto h-auto object-contain transition-transform group-hover:scale-105",
                    imageClassName,
                  )}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-8 px-3 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCropping(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={removeImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full border border-border/50">
                <RefreshCw className="w-3 h-3 animate-pulse" />
                <span className="truncate max-w-[150px]">Click or drag to replace</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-sm">Upload Image</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                  PNG, JPG or WEBP
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

