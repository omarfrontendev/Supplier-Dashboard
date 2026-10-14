import { useEffect, useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { useGetUploadContent } from "@/api/modules/useUploads";

interface HotelGalleryImageProps {
  uploadId: number;
  alt: string;
  className?: string;
}

export function HotelGalleryImage({
  uploadId,
  alt,
  className,
}: HotelGalleryImageProps) {
  const { data: blob, isLoading, isError } = useGetUploadContent(uploadId);
  const [imageUrl, setImageUrl] = useState<string>();

  useEffect(() => {
    if (!blob) {
      setImageUrl(undefined);
      return;
    }

    const url = URL.createObjectURL(blob);

    setImageUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [blob]);

  if (isLoading || !imageUrl) {
    return (
      <div
        className={`flex items-center justify-center bg-surface-image ${className ?? ""}`}
      >
        <ImageIcon
          className="h-6 w-6 animate-pulse text-primary/40"
          aria-hidden="true"
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className={`flex items-center justify-center bg-surface-image ${className ?? ""}`}
      >
        <ImageIcon
          className="h-6 w-6 text-primary/40"
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      loading="lazy"
      className={className}
    />
  );
}