import React, { useState } from "react";
import {
  Download,
  Image,
  FileText,
  File,
  ExternalLink,
  X,
  ZoomIn,
} from "lucide-react";

interface MessageAttachmentViewProps {
  attachments: string[];
  messageType?: string;
}

const MessageAttachmentView: React.FC<MessageAttachmentViewProps> = ({
  attachments = [],
  messageType,
}) => {
  const [modalImage, setModalImage] = useState<string | null>(null);

  // Handle keyboard events for modal
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && modalImage) {
        closeModal();
      }
    };

    if (modalImage) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent scrolling behind modal
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [modalImage]);

  if (!attachments.length) return null;

  const getFileInfo = (url: string) => {
    const filename = url.split("/").pop() || "file";
    const extension = filename.split(".").pop()?.toLowerCase();

    let icon = <File className="w-4 h-4" />;
    let isImage = false;

    if (["jpg", "jpeg", "png", "gif"].includes(extension || "")) {
      icon = <Image className="w-4 h-4" />;
      isImage = true;
    } else if (["pdf", "doc", "docx"].includes(extension || "")) {
      icon = <FileText className="w-4 h-4" />;
    }

    return { filename, extension, icon, isImage };
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = (url: string) => {
    window.open(url, "_blank");
  };

  const handleImageClick = (url: string) => {
    setModalImage(url);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  const isCloudinaryImage = (url: string) => {
    return url.includes("cloudinary.com") && url.includes("image/upload");
  };

  const getOptimizedImageUrl = (url: string, width = 400) => {
    if (isCloudinaryImage(url)) {
      // Insert transformation parameters for Cloudinary images
      return url.replace(
        "/upload/",
        `/upload/w_${width},c_scale,f_auto,q_auto/`
      );
    }
    return url;
  };

  const getThumbnailUrl = (url: string) => {
    return getOptimizedImageUrl(url, 200);
  };

  return (
    <div className="space-y-2 mt-2">
      {attachments.map((url, index) => {
        const { filename, extension, icon, isImage } = getFileInfo(url);

        return (
          <div
            key={index}
            className={`border rounded-lg overflow-hidden ${
              isImage ? "bg-transparent" : "bg-gray-50"
            }`}
          >
            {isImage ? (
              // Image Preview
              <div
                className="relative group cursor-pointer"
                onClick={() => handleImageClick(url)}
              >
                <img
                  src={getThumbnailUrl(url)}
                  alt={filename}
                  className="w-full max-w-sm max-h-64 object-cover rounded-lg hover:opacity-90 transition-all duration-200"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center rounded-lg">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black bg-opacity-50 rounded-full p-2">
                    <ZoomIn className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="absolute top-2 right-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(url, filename);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-70"
                    title="Download image"
                  >
                    <Download className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            ) : (
              // File Link
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  {icon}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{filename}</p>
                    <p className="text-xs text-gray-500 uppercase">
                      {extension} file
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleDownload(url, filename)}
                    className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors border border-blue-300"
                    title="Download file"
                  >
                    <Download className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handlePreview(url)}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    title="Preview file"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Image Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-4xl max-h-[90vh] flex items-center justify-center">
            <img
              src={getOptimizedImageUrl(modalImage, 800)}
              alt="Enlarged view"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 transition-all"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(modalImage, "image");
              }}
              className="absolute top-4 left-4 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 transition-all"
              title="Download image"
            >
              <Download className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageAttachmentView;
