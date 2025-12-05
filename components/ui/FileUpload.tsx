import React, { useState } from "react";
import { Upload, X, Image, FileText, File } from "lucide-react";
import { MessageAttachment } from "@/types/message.type";
import { useAuth } from "@/contexts/AuthContext";
import { createApiHeadersWithoutContentType } from "@/lib/api-utils";

interface FileUploadProps {
  onFilesSelected: (files: MessageAttachment[]) => void;
  maxFiles?: number;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  maxFiles = 5,
  disabled = false,
}) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<MessageAttachment[]>([]);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    if (selectedFiles.length + files.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const headers = createApiHeadersWithoutContentType(user);

      const response = await fetch("/api/upload/message-files", {
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const result = await response.json();
      const newFiles = [...selectedFiles, ...result.files];
      setSelectedFiles(newFiles);
      onFilesSelected(newFiles);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload files. Please try again.");
    } finally {
      setUploading(false);
      // Clear the input
      event.target.value = "";
    }
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image className="w-4 h-4" />;
    if (type.includes("pdf") || type.includes("document"))
      return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-2">
      {/* Upload Button */}
      <div className="flex items-center space-x-2">
        <label
          className={`flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
            disabled || uploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Upload className="w-4 h-4" />
          <span className="text-sm">
            {uploading ? "Uploading..." : "Attach Files"}
          </span>
          <input
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt"
            onChange={handleFileSelect}
            disabled={disabled || uploading}
            className="hidden"
          />
        </label>

        {selectedFiles.length > 0 && (
          <span className="text-xs text-gray-500">
            {selectedFiles.length}/{maxFiles} files
          </span>
        )}
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="space-y-1">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 rounded border"
            >
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                {getFileIcon(file.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => removeFile(index)}
                className="p-1 hover:bg-gray-200 rounded"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
