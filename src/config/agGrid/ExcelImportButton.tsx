import React, { useCallback, useState } from 'react';
import * as XLSX from 'xlsx';
import { useDropzone } from 'react-dropzone';
import { FaFileExcel } from "react-icons/fa";
import { ReloadIcon } from '@radix-ui/react-icons';

interface ExcelImportButtonProps {
  onImport: (data: any[]) => void;
}

const ExcelImportButton: React.FC<ExcelImportButtonProps> = ({ onImport }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileRead = (file: File) => {
    setLoading(true);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        onImport(jsonData);
      } catch (err) {
        setError('Failed to read the Excel file. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      handleFileRead(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop ,accept : {
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'application/vnd.ms-excel': ['.xls']
  }});

  return (
    <div {...getRootProps()} className='flex items-center flex-col justify-center h-full px-[20px]'>
      <input {...getInputProps()} accept='.xlsx, .xls'/>
      <div className='flex items-center flex-col justify-center w-full h-full border-dashed py-[20px] rounded border-2 border-slate-400'>
        <div className='w-[150px] h-[150px] bg-[#21734621] rounded-full flex justify-center items-center'>
          {loading ? (
            <ReloadIcon className='h-[50px] w-[50px] text-[#217346] animate-spin' /> // Placeholder for a spinner
          ) : (
            <FaFileExcel className='h-[50px] w-[50px] text-[#217346]' />
          )}
        </div>
        <p className='text-stae-600 text-[18px] mt-[10px]'> {isDragActive ? 'Drop the file here...' : loading ? 'Uploading...' : 'Drag and drop your file here'}</p>
        <p className='text-[18px] font-[400] text-cyan-600 text-center mt-[20px]'>
          {isDragActive ? 'Drop the file here...' : loading ? 'Uploading...' : 'Click here to browse on your device'}
        </p>
        {error && <p className='mt-2 text-red-500'>{error}</p>}
      </div>
    </div>
  );
};

export default ExcelImportButton;
