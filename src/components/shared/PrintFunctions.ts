import printJS from "print-js";
import fileDownload from "js-file-download";
export const printFunction = (buffer: ArrayBuffer) => {
  // Create a Blob with the correct type and data
  const file = new Blob([new Uint8Array(buffer)], { type: "application/pdf" });

  // Create an object URL from the Blob
  const url = URL.createObjectURL(file);

  // Use printJS to print the document
  printJS(url);

  // Optionally, revoke the object URL after printing
  URL.revokeObjectURL(url);
};

export const handleDownloadExcel = (
  bufferData: any,
  filename = "download.xlsx"
) => {
  const byteCharacters = new Uint8Array(bufferData);
  const blob = new Blob([byteCharacters], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // Create a link to download the file
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  link.click();

  // Clean up the URL object
  window.URL.revokeObjectURL(link.href);
};

export const downloadFunction = (buffer: any, filename: string) => {
  const file = new Blob([new Uint8Array(buffer)], {
    type: "application/pdf",
  });
  fileDownload(file, `${filename}.pdf`);
};
const downloadExcel = (buffer: any, filename: any, type: any) => {
  const file = new Blob([new Uint8Array(buffer)]);
  fileDownload(file, filename + ".xlsx");
};
