import { ColDef } from "ag-grid-community";
import { MoreOutlined } from "@ant-design/icons";
import { Button, Dropdown, Form, Menu } from "antd";
import { useState } from "react";
import { ConfirmCancellationDialog } from "@/config/agGrid/registerModule/ConfirmCancellationDialog";
import { AppDispatch } from "@/store";
import { useDispatch } from "react-redux";
import { toast } from "@/components/ui/use-toast";
import { printSellInvoice } from "@/features/salesmodule/salesInvoiceSlice";
import CopyCellRenderer from "@/components/shared/CopyCellRenderer";
import { printFunction } from "@/components/shared/PrintFunctions";
import { cancelEInvoice, cancelEwayBill } from "@/features/salesmodule/salesTransactionSlice";

const ActionMenu: React.FC<any> = ({ row }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [type, setType] = useState<string>("");
  const [module, setModule] = useState("");
  const [form] = Form.useForm();

  const handlePrintInvoice = async (orderId: string, section: string) => {
    if (section === "e-waybill") {
      toast({
        title: "Cannot Generate print of Eway Bill",
        className: "bg-green-600 text-white items-center",
      });
    } else {
      dispatch(
        printSellInvoice({ invoiceNo: orderId, printType: "Original" })
      ).then((response: any) => {
        if (response?.payload?.success) {
          printFunction(response?.payload?.data.buffer.data);
        }
      });
    }
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const payload = createPayload(values);
        const action = getCancelAction(payload);
        console.log(payload,action)
        dispatch(action).then((response: any) => {
          if (response?.payload?.success) {
            toast({
              title: response?.message || "Cancelled successfully",
              className: "bg-green-600 text-white items-center",
            });
          }
        });

        setCancelModalVisible(false);
        form.resetFields();
        setType("");
      })
      .catch((errorInfo) => {
        console.error("Validation Failed:", errorInfo);
        // form.resetFields();
      });
  };

  const createPayload = (values: any) => {
    if (module === "e-invoice") {
      return {
        invoice_no: row?.invoiceNo,
        irn: row?.irnno,
        cancellReason: values.reason,
        remark: values.remark,
      };
    } else if (module === "e-waybill") {
      return {
        ewayBillNo: row?.ewaybillno,
        cancellReason: values.reason,
        remark: values.remark,
      };
    }
  };

  const getCancelAction = (payload: any) => {
    if (module === "e-invoice") {
      return cancelEInvoice(payload);
    } else if (module === "e-waybill") {
      return cancelEwayBill(payload);
    }
  };
  const menu = (
    <Menu>
      <Menu.Item
        key="cancel"
        onClick={() => {
          if (row?.eInvoiceNo) {
            setModule("e-invoice");
          } else if (row?.ewaybillno) {
            setModule("e-waybill");
          }
          setCancelModalVisible(true);
        }}
        disabled={
          row.eInvoice_status == "CANCELLED" ||
          row.ewaybill_status == "CANCELLED"
        }
      >
        Cancel
      </Menu.Item>
      <Menu.Item
        key="print"
        onClick={() => {
          if (row?.eInvoiceNo) {
            handlePrintInvoice(row?.invoiceNo, "e-invoice");
          } else if (row?.eway_bill_no) {
            handlePrintInvoice(row?.eway_bill_no, "e-waybill");
          } else {
            toast({
              title: "In Development , We will Update Soon!",
              className: "bg-blue-600 text-white items-center",
            });
          }
        }}
      >
        Print
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Dropdown overlay={menu} trigger={["click"]}>
        <Button icon={<MoreOutlined />} />
      </Dropdown>
      <ConfirmCancellationDialog
        isDialogVisible={cancelModalVisible}
        handleOk={handleOk}
        handleCancel={() => setCancelModalVisible(false)}
        row={{ req_id: row?.invoiceNo }}
        form={form}
        module="E-Invoice"
        type={type}
        setType={setType}
      />
    </>
  );
};

export default ActionMenu;

export const TruncateCellRenderer = (props: any) => {
  const style = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "100%", // Ensure the width of the cell
    display: "block", // Ensure that the content respects the overflow
  };

  return <div style={style}>{props.value}</div>;
};

export const columnDefs: ColDef<any>[] = [
  {
    headerName: "Actions",
    maxWidth: 100,
    cellRenderer: (params: any) => <ActionMenu row={params.data} />,
  },
  { headerName: "#", valueGetter: "node.rowIndex + 1", maxWidth: 50 },
  {
    headerName: "Status",
    field: "eInvoice_status",
    filter: "agDateColumnFilter",
    cellRenderer: "truncateCellRenderer",
    maxWidth: 100,
  },
  // {
  //   headerName: "SO ID",
  //   field: "so_no",
  //   filter: "agDateColumnFilter",
  //   maxWidth: 150,
  //   cellRenderer: CopyCellRenderer,
  // },
  {
    headerName: "Invoice Date",
    field: "eInvoiceDate",
    filter: "agDateColumnFilter",
    cellRenderer: "truncateCellRenderer",
  },
  {
    headerName: "Invoice Number",
    field: "invoiceNo",
    filter: "agTextColumnFilter",
    cellRenderer: CopyCellRenderer,
  },
  {
    headerName: "Bill To Name",
    field: "billToName",
    filter: "agTextColumnFilter",
    cellRenderer: "truncateCellRenderer",
  },
  {
    headerName: "Bill To",
    field: "billTo",
    filter: "agTextColumnFilter",
    width: 400,
    cellRenderer: "truncateCellRenderer",
  },
  {
    headerName: "Ack No",
    field: "eInvoiceNo",
    filter: "agTextColumnFilter",
    cellRenderer: CopyCellRenderer,
  },
  {
    headerName: "Ack Date",
    field: "eInvoiceDate",
    filter: "agDateColumnFilter",
    cellRenderer: "truncateCellRenderer",
  },
  {
    headerName: "IRN Number",
    field: "irnno",
    filter: "agTextColumnFilter",
    cellRenderer: CopyCellRenderer,
  },
  {
    headerName: "Bill From Address",
    field: "billFromAddress",
    width: 400,
    filter: "agTextColumnFilter",
    cellRenderer: "truncateCellRenderer",
  },
  {
    headerName: "Dispatch From Address",
    field: "shippingaddress2",
    width: 400,
    filter: "agTextColumnFilter",
    cellRenderer: "truncateCellRenderer",
  },
];

export const EwayBillColumnDefs: ColDef<any>[] = [
  {
    headerName: "Actions",
    maxWidth: 100,
    cellRenderer: (params: any) => <ActionMenu row={params.data} />,
  },
  { headerName: "#", valueGetter: "node.rowIndex + 1", maxWidth: 50 },
  {
    headerName: "Status",
    field: "ewaybill_status",
    filter: "agDateColumnFilter",
    cellRenderer: "truncateCellRenderer",
    maxWidth: 100,
  },
  {
    headerName: "SO ID",
    field: "so_no",
    filter: "agDateColumnFilter",
    cellRenderer: CopyCellRenderer,
    maxWidth: 150,
  },
  {
    headerName: "Invoice Date",
    field: "createDt",
    filter: "agDateColumnFilter",
    cellRenderer: "truncateCellRenderer",
  },
  {
    headerName: "Invoice Number",
    field: "invoiceNo",
    filter: "agTextColumnFilter",
    cellRenderer: CopyCellRenderer,
  },
  {
    headerName: "Supply Type",
    field: "supply_type",
    filter: "agTextColumnFilter",
    cellRenderer: "truncateCellRenderer",
  },
  {
    headerName: "E-way Bill Number",
    field: "ewaybillno",
    filter: "agTextColumnFilter",
    cellRenderer: CopyCellRenderer,
  },
  {
    headerName: "Doc Type",
    field: "document_type",
    filter: "agTextColumnFilter",
    cellRenderer: "truncateCellRenderer",
  },
  {
    headerName: "Bill To Name",
    field: "billToName",
    filter: "agTextColumnFilter",
    cellRenderer: "truncateCellRenderer",
  },
  {
    headerName: "Bill To Address",
    field: "billTo",
    filter: "agTextColumnFilter",
    width: 400,
    cellRenderer: CopyCellRenderer,
  },
  {
    headerName: "Bill From Address",
    field: "billFromAddress",
    filter: "agDateColumnFilter",
    cellRenderer: "truncateCellRenderer",
  },

  {
    headerName: "Shipping Address",
    field: "shippingaddress2",
    filter: "agDateColumnFilter",
    width: 400,
    cellRenderer: CopyCellRenderer,
  },
];
