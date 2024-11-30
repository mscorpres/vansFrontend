import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaFileExcel } from "react-icons/fa";
import { ReloadIcon } from "@radix-ui/react-icons";
import { toast } from "@/components/ui/use-toast";

interface ExcelImportButtonProps {
  uploadFunction: (file: File) => Promise<any>; // Function to handle file upload
  onImport: (data: any) => void; // Callback for handling successful import
  acceptFileTypes?: string[]; // Acceptable file types
}

const ExcelImportButton: React.FC<ExcelImportButtonProps> = ({
  uploadFunction,
  onImport,
  acceptFileTypes = [".xlsx", ".xls"], // Default accepted file types
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setLoading(true);
        setError(null);

        uploadFunction(file) // Call the passed upload function
          .then((resultAction) => {
            // console.log("API Response:", resultAction);

            if (resultAction.payload?.success) {
              toast({
                title: resultAction.payload.message,
                className: "bg-green-600 text-white items-center",
              });
              onImport(resultAction.payload); // Pass backend response here
            } else {
              setError("Failed to upload the file. Please try again.");
            }
          })
          .catch(() => setError("Failed to upload the file. Please try again."))
          .finally(() => setLoading(false));
      }
    },
    [uploadFunction, onImport]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptFileTypes.reduce((acc, type) => {
      acc[`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`] =
        [type];
      return acc;
    }, {} as Record<string, string[]>),
  });

  return (
    <div
      {...getRootProps()}
      className="flex items-center flex-col justify-center h-full px-5"
    >
      <input {...getInputProps()} accept={acceptFileTypes.join(",")} />
      <div className="flex flex-col items-center justify-center w-full h-full border-dashed py-5 rounded border-2 border-slate-400">
        <div className="w-36 h-36 bg-[#21734621] rounded-full flex justify-center items-center">
          {loading ? (
            <ReloadIcon className="h-12 w-12 text-[#217346] animate-spin" />
          ) : (
            <FaFileExcel className="h-12 w-12 text-[#217346]" />
          )}
        </div>
        <p className="text-gray-600 text-lg mt-2">
          {isDragActive
            ? "Drop the file here..."
            : loading
            ? "Uploading..."
            : "Drag and drop your file here"}
        </p>
        {error && <p className="mt-2 text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default ExcelImportButton;
