import * as xlsx from "xlsx";

const mergeRows = (rows: any) => {
  return rows.map((row: any) => {
    const newRow = row.reduce((r: any, c: any) => ({ ...r, ...c }), {});
    return newRow;
  });
};
const arrayFromObject = (rows: any, columnsFields: any) => {
  const finalRows = rows.map((row: any) => {
    let obj = row;
    let arr: any = [];
    columnsFields.map((key: any) => {
      // if (obj[key] != undefined) {
      arr = [...arr, obj[key] ?? "--"];
      // }
    });
    return arr;
  });

  return finalRows;
};
const cleanString = (str: any) => {
  return str
    .toString()
    .replaceAll(",", ";")
    .replaceAll(";", "")
    .replaceAll("/n", " ")
    .replaceAll("\n", " ")
    .replaceAll("\r", " ")
    .replaceAll("/r", " ")
    .replaceAll("<br>", " ");
};

export const downloadCSVAntTable = (rows, columns, name) => {
  try {
    let arr1: any = [];

    let arr = rows.map((row: any) => {
      return columns.map((col: any) => {
        if (col.type != "actions") {
          if (row[col.dataIndex] || row[col.dataIndex] == "0") {
            return {
              [col.headerName]: row[col.dataIndex],
            };
          } else {
            return { [col.headerName]: "" };
          }
        }
      });
    });

    arr = mergeRows(arr);

    arr.map((row: any) => {
      let obj: any = {};

      for (var key in row) {
        if (key !== "id") {
          obj = {
            ...obj,
            [key]: row[key]
              ? row[key].toString().includes("/")
                ? cleanString(row[key])
                : cleanString(row[key])
              : "--",
          };
        }
      }
      delete obj["id"];
      arr1.push(obj);
    });

    let headers = [];
    let data = [];

    for (let key in arr1[0]) {
      headers.push(key);
    }
    data = arr1.map((row: any) => {
      let arr2 = [];
      for (let key in row) {
        arr2.push(row[key]);
      }

      return arr2;
    });

    exportCSVFile([headers, ...data], name ? name : "File");
  } catch (error) {
    console.error(error);
  }
};

export const downloadCSV = (
  rows: any,
  columns: any,
  name: any,
  newRows: any
) => {
  try {
    const columnsArr = columns
      .filter((row: any) => row.type !== "actions")
      .map((row: any) => row.headerName);
    const columnsFields = columns
      .filter((row: any) => row.type !== "actions")
      .map((row: any) => row.field);
    const rowsArr = arrayFromObject(rows, columnsFields);

    rowsArr.unshift(columnsArr);
    if (newRows) {
      const newRowsTemp = arrayFromObject(newRows, columnsFields);
      newRowsTemp.map((row: any) => rowsArr.unshift(row));
    }

    exportCSVFile(rowsArr, name ?? "File");
  } catch (error) {
    console.error(error);
  }
};

export const downloadCSVnested = (
  rows: any,
  columns: any,
  name: any,
  newRows: any
) => {
  try {
    const columnsArr = columns
      .filter((row: any) => row.type !== "actions")
      .map((row: any) => row.title);
    const columnsFields = columns.map((row: any) => row.key);

    const rowsArr = arrayFromObject(rows, columnsFields);

    rowsArr.unshift(columnsArr);
    if (newRows) {
      const newRowsTemp = arrayFromObject(newRows, columnsFields);
      newRowsTemp.map((row: any) => rowsArr.unshift(row));
    }
    exportCSVFile(rowsArr, name ?? "File");
  } catch (error) {
    console.error(error);
  }
};

export const downloadCSVCustomColumns = (csvData: any, name: any) => {
  try {
    let arr1: any = [];
    csvData.map((row: any) => {
      let obj: any = {};

      for (var key in row) {
        if (key !== "id") {
          obj = {
            ...obj,
            [key]: row[key]
              ? row[key].toString().includes("/")
                ? cleanString(row[key])
                : cleanString(row[key])
              : "--",
          };
        }
      }
      delete obj["id"];
      arr1.push(obj);
    });

    let headers = [];
    let data = [];

    for (let key in arr1[0]) {
      headers.push(key);
    }
    data = arr1.map((row: any) => {
      let arr2 = [];
      for (let key in row) {
        arr2.push(row[key]);
      }

      return arr2;
    });

    exportCSVsFile([headers, ...data], name ? name : "File");
  } catch (error) {
    console.error(error);
  }
};

export function exportCSVFile(items: any, fileTitle: any) {
  let arr = items;
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.aoa_to_sheet(arr);
  xlsx.utils.book_append_sheet(wb, ws, "Sheet 1");
  xlsx.writeFile(wb, `${fileTitle}.xlsx`);
}
export function exportCSVsFile(items: any, fileTitle: any) {
  let arr = items;
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.aoa_to_sheet(arr);
  xlsx.utils.book_append_sheet(wb, ws, "Sheet 1");
  xlsx.writeFile(wb, `${fileTitle}.csv`);
}
