import { Input } from "@/components/ui/input";
import { useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { Select } from "antd";
import { transformCurrencyData } from "@/helper/transform";
import CurrencyRateDialog from "@/components/ui/CurrencyRateDialog";
import { CommonModal } from "@/config/agGrid/registerModule/CommonModal";

const CreditTextInputCellRenderer = (props: any) => {
  const [openCurrencyDialog, setOpenCurrencyDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const { value, colDef, data, api, column, setRowData, currency } = props;

  console.log(`Rendering field: ${colDef.field}, value:`, value);

  const handleDeleteRow = (rowIndex: number) => {
    setSelectedRowIndex(rowIndex);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    if (selectedRowIndex !== null) {
      setRowData((prevData: any) =>
        prevData.filter((_: any, index: any) => index !== selectedRowIndex)
      );
      api.applyTransaction({
        remove: [api.getDisplayedRowAtIndex(selectedRowIndex).data],
      });
    }
    setShowConfirmDialog(false);
  };

  const updateData = (newData: any) => {
    api.applyTransaction({ update: [newData] });
    api.refreshCells({ rowNodes: [props.node], columns: [column] });
  };

  const handleCurrencyChange = (value: any) => {
    data["currency"] = value;
    setOpenCurrencyDialog(true);
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    data[name] = value;

    // CHANGED: Recalculate GST whenever rate or orderQty changes
    if (name === "rate" || name === "orderQty") {
      const rate = parseFloat(data.rate) || 0;
      const orderQty = parseFloat(data.orderQty) || 0;
      const localValue = rate * orderQty;
      data["localValue"] = localValue;

      const gstRate = parseFloat(data.gstRate) || 0;
      const gstCalculation = (localValue * gstRate) / 100;

      let cgst = 0, sgst = 0, igst = 0;

      // CHANGED: Use gstType ID (L or I) for calculation
      if (data.gstType === "L") {
        cgst = gstCalculation / 2;
        sgst = gstCalculation / 2;
        igst = 0;
      } else if (data.gstType === "I") {
        igst = gstCalculation;
        cgst = 0;
        sgst = 0;
      }

      // CHANGED: Store as numbers with 2 decimal precision
      data.cgst = parseFloat(cgst.toFixed(2));
      data.sgst = parseFloat(sgst.toFixed(2));
      data.igst = parseFloat(igst.toFixed(2));

      console.log("GST Recalculated:", { cgst: data.cgst, sgst: data.sgst, igst: data.igst });
    }

    // CHANGED: Trigger state update to recalculate totals
    setRowData((prevData: any) => {
      const newData = [...prevData];
      const rowIndex = props.node.rowIndex;
      newData[rowIndex] = { ...data };
      return newData;
    });

    api.refreshCells({ rowNodes: [props.node], force: true });
    api.applyTransaction({ update: [data] });
  };

  const submitCurrencyRate = (field: string, value: any) => {
    data[field] = value?.rate;
  };

  const renderContent = () => {
    switch (colDef.field) {
      case "delete":
        return (
          <div className="flex justify-center">
            <button
              onClick={() => handleDeleteRow(props.node.rowIndex)}
              className={
                api.getDisplayedRowCount() <= 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-red-500 hover:text-red-700 pt-3"
              }
              aria-label="Delete"
              disabled={api.getDisplayedRowCount() <= 1}
            >
              <FaTrash />
            </button>
            <CommonModal
              isDialogVisible={showConfirmDialog}
              handleOk={handleConfirmDelete}
              handleCancel={() => setShowConfirmDialog(false)}
              title="Reset Details"
              description="Are you sure you want to remove this entry?"
            />
          </div>
        );
      
      case "material":
        return (
          <Input
            readOnly
            value={value || ""}
            type="text"
            placeholder={colDef.headerName}
            className="w-[100%] text-slate-600 border-none shadow-none mt-[2px]"
          />
        );
      
      // CHANGED: Display GST Type text (LOCAL/INTER STATE) instead of ID
      case "gstType":
        return (
          <Input
            readOnly
            value={data.gstTypeText || value || ""}
            type="text"
            placeholder={colDef.headerName}
            className="w-[100%] text-slate-600 border-none shadow-none mt-[2px]"
          />
        );
      
      case "partno":
        return (
          <Input
            readOnly
            value={value || ""}
            type="text"
            placeholder={colDef.headerName}
            className="w-[100%] text-slate-600 border-none shadow-none mt-[2px]"
          />
        );
      
      case "itemName":
        return (
          <Input
            readOnly
            value={value || ""}
            type="text"
            placeholder={colDef.headerName}
            className="w-[100%] text-slate-600 border-none shadow-none mt-[2px]"
          />
        );
      
      // CHANGED: Show currency symbol from data instead of hardcoded default
      case "rate":
        return (
          <>
            <Input
              name={colDef.field}
              onChange={handleInputChange}
              value={value}
              type="number"
              placeholder={colDef.headerName}
              className="w-[100%] text-slate-600 border-slate-400 shadow-none mt-[2px]"
            />
            <Select
              className="w-1/3"
              labelInValue
              filterOption={false}
              placeholder="Currency"
              // CHANGED: Use currency symbol from data instead of hardcoded ₹
              value={{ 
                value: data.currency, 
                label: data.currencySymbol || "₹" 
              }}
              options={transformCurrencyData(currency || [])}
              onChange={(e) => handleCurrencyChange(e.value)}
            />
            <CurrencyRateDialog
              open={openCurrencyDialog}
              onClose={() => setOpenCurrencyDialog(false)}
              currency={data.currency || ""}
              price={parseFloat(data.rate) || 0}
              inputHandler={submitCurrencyRate}
              rowId={data.rowId}
            />
          </>
        );
      
      case "orderQty":
        return (
          <Input
            name={colDef.field}
            onChange={handleInputChange}
            value={value}
            type="number"
            placeholder={colDef.headerName}
            className="w-[100%] text-slate-600 border-slate-400 shadow-none mt-[2px]"
          />
        );
      
      case "materialDescription":
      case "hsnCode":
      case "remark":
      case "dueDate":
        return (
          <Input
            readOnly
            value={value || ""}
            type="text"
            placeholder={colDef.headerName}
            className="w-[100%] text-slate-600 border-none shadow-none mt-[2px]"
          />
        );
      
      // CHANGED: Format GST and value fields to 2 decimal places
      case "localValue":
      case "foreignValue":
      case "cgst":
      case "sgst":
      case "igst":
        return (
          <Input
            readOnly
            value={typeof value === "number" ? value.toFixed(2) : (value || "")}
            type="text"
            placeholder={colDef.headerName}
            className="w-[100%] text-slate-600 border-none shadow-none mt-[2px]"
          />
        );
      
      default:
        console.warn(`Unhandled field in CreditTextInputCellRenderer: ${colDef.field}`);
        return (
          <Input
            readOnly
            value={value || ""}
            type="text"
            placeholder={colDef.headerName}
            className="w-[100%] text-slate-600 border-none shadow-none mt-[2px]"
          />
        );
    }
  };

  if (data.isNew) {
    return renderContent();
  }

  return <span>{value || "--"}</span>;
};

export default CreditTextInputCellRenderer;