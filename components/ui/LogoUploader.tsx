"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createApiHeadersWithoutContentType } from "@/lib/api-utils";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface LogoUploaderProps {
  currentLogo?: string;
  onLogoChange: (logoUrl: string) => void;
  onUploadStateChange?: (isUploading: boolean) => void;
  disabled?: boolean;
}

export default function LogoUploader({
  currentLogo,
  onLogoChange,
  onUploadStateChange,
  disabled = false,
}: LogoUploaderProps) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(currentLogo || "");
  const [uploadError, setUploadError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Clear previous errors
    setUploadError("");

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError("File too large. Maximum size is 5MB.");
      return;
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setUploadError(
        "Invalid file type. Please upload a JPG, PNG, GIF, or WebP image."
      );
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    onUploadStateChange?.(true);

    try {
      const formData = new FormData();
      formData.append("logo", file);

      const response = await fetch("/api/upload/logo", {
        method: "POST",
        headers: createApiHeadersWithoutContentType(user),
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        onLogoChange(data.logoUrl);
        setPreviewUrl(data.logoUrl);
        setUploadError("");
      } else {
        setUploadError(data.error || "Failed to upload logo");
        setPreviewUrl(currentLogo || "");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(
        "Network error. Please check your connection and try again."
      );
      setPreviewUrl(currentLogo || "");
    } finally {
      setUploading(false);
      onUploadStateChange?.(false);
    }
  };

  const handleRemoveLogo = () => {
    setPreviewUrl("");
    onLogoChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Company Logo
      </label>

      <div className="flex items-start space-x-4">
        {/* Preview */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Company logo"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <ImageIcon className="w-8 h-8 text-gray-400" />
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex-1 space-y-2">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleUploadClick}
              disabled={disabled || uploading}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? "Uploading..." : "Upload Logo"}
            </button>

            {previewUrl && (
              <button
                type="button"
                onClick={handleRemoveLogo}
                disabled={disabled || uploading}
                className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                <X className="w-4 h-4 mr-2" />
                Remove
              </button>
            )}
          </div>

          <p className="text-xs text-gray-500">
            Upload a square logo image. Max 5MB. Supported formats: JPG, PNG,
            GIF, WebP
          </p>

          {uploadError && (
            <p className="text-xs text-red-600 mt-1 font-medium">
              {uploadError}
            </p>
          )}

          {uploading && (
            <div className="flex items-center mt-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
              <span className="text-xs text-primary font-medium">
                Uploading...
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />
    </div>
  );
}
