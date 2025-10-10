import { RowData } from "@/types/SalesInvoiceTypes";
import { ColDef } from "ag-grid-community";
import { Button, Dropdown, Form } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  addfreight,
  cancelInvoice,
  fetchDataNotes,
  fetchInvoiceDetail,
  fetchSalesOrderInvoiceList,
  printExportInvoice,
  printSellInvoice,
} from "@/features/salesmodule/salesInvoiceSlice";
import { AppDispatch, RootState } from "@/store";
import { useState } from "react";
import { ConfirmCancellationDialog } from "@/config/agGrid/registerModule/ConfirmCancellationDialog";
import ViewInvoiceModal from "@/config/agGrid/salesmodule/ViewInvoiceModal";
import { downloadFunction, printFunction } from "@/components/shared/PrintFunctions";
import AddFreightModal from "./salesmodule/AddFreightModal"; 
import CreditNote from "./invoiceModule/CreditNote";

const ActionMenu: React.FC<any> = ({ row }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [viewInvoice, setViewInvoice] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [addFreightModalVisible, setAddFreightModalVisible] = useState(false); // New state for freight modal

const [viewCreditNote, setViewCreditNote] = useState(false);
  const [form] = Form.useForm();
  const { challanDetails,dataNotes, loading }: any = useSelector(
    (state: RootState) => state.sellInvoice
  );

  
  const dateRange = useSelector(
    (state: RootState) => state.sellRequest.dateRange
  );

  const handleViewInvoice = (row: any) => {
    setViewInvoice(true);
    dispatch(fetchInvoiceDetail({ invoiceNo: row.invoiceNo }));
  };
    const handleViewCreditNote = (row: any) => {
      console.log(row.shipment_id);
    dispatch(fetchDataNotes({ shipment_id: row.shipmentId}));
    setViewCreditNote(true);
  };

  const handleAddFreight = (so_inv_id: string, freight: string) => {
    dispatch(addfreight({ so_inv_id, freight }));
  };

  const handlePrintInvoice = async (orderId: string, printInvType: string) => {
    dispatch(
      printSellInvoice({ invoiceNo: orderId, printType: printInvType })
    ).then((response: any) => {
      if (response?.payload?.success) {
        printFunction(response?.payload?.data.buffer.data,
          response?.payload?.data.filename);
      }
    });
  };
    const handleExportInvoice = async (orderId: string, printInvType: string) => {
    dispatch(
      printExportInvoice({ invoiceNo: orderId, printType: printInvType })
    ).then((response: any) => {
      if (response?.payload?.success) {
        printFunction(response?.payload?.data.buffer.data,
          response?.payload?.data.filename);
      }
    });
  };
    const handlePrintClick = () => {
    if (row?.approveStatus !== "PENDING") {
      handleViewCreditNote(row);
      console.log("rrrrrrrrrrrrr",row);
      
      
    }
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const payload = {
          cancelReason: values.remark,
          invoice_no: row.invoiceNo,
        };
        dispatch(cancelInvoice(payload)).then((response: any) => {
          if (response?.payload?.success) {
            form.resetFields();
            dispatch(
              fetchSalesOrderInvoiceList({
                type: "date_wise",
                data: dateRange,
              }) as any
            );
          }
        });
        setCancelModalVisible(false);
      })
      .catch((errorInfo) => {
        console.error("Validation Failed:", errorInfo);
      });
  };

  const isDisabled = row.invStatus === "Cancelled";

  const menuItems = [
    {
      key: "AddFreight",
      label: (
        <div onClick={() => setAddFreightModalVisible(true)}>Add Freight</div>
      ), 
    },
    {
      key: "view",
      label: <div onClick={() => handleViewInvoice(row)}>View</div>,
    },
    {
      key: "materialList",
      label: (
        <div
          onClick={() => !isDisabled && setCancelModalVisible(true)}
          style={{
            color:
              isDisabled || row?.ewaybill === "Y" || row?.eInvoice === "Y"
                ? "gray"
                : "inherit",
            cursor:
              isDisabled || row?.ewaybill === "Y" || row?.eInvoice === "Y"
                ? "not-allowed"
                : "pointer",
          }}
        >
          Cancel
        </div>
      ),
      disabled: isDisabled || row?.ewaybill === "Y" || row?.eInvoice === "Y",
    },
    {
      key: "createCreditNote",
      label: (
        <div
          onClick={handlePrintClick} // Separate function to handle print click
          style={{
            cursor: row?.approveStatus === "PENDING" ? "not-allowed" : "pointer",
            color: row?.approveStatus === "PENDING" ? "gray" : "inherit",
          }}
        >
          Credit Note
        </div>
      ),
      disabled: row?.approveStatus === "PENDING",
    },
  ];

  return (
    <>
      <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
        <Button icon={<MoreOutlined />} />
      </Dropdown>
      <ViewInvoiceModal
        visible={viewInvoice}
        onClose={() => setViewInvoice(false)}
        sellRequestDetails={challanDetails}
        handlePrintInvoice={handlePrintInvoice}
        handleExportInvoice={handleExportInvoice}
        loading={loading}
      />
      <ConfirmCancellationDialog
        isDialogVisible={cancelModalVisible}
        handleOk={handleOk}
        handleCancel={() => setCancelModalVisible(false)}
        row={{ req_id: row.so_ship_invoice_id }}
        form={form}
        module="Invoice"
        loading={loading}
      />
      
      <AddFreightModal
        visible={addFreightModalVisible}
        onClose={() => setAddFreightModalVisible(false)}
        invoiceNo={row.invoiceNo}
      />

      <CreditNote
        visible={viewCreditNote}
        onClose={() => setViewCreditNote(false)}
        sellRequestDetails={dataNotes || []}
        row={{ req_id: row.invoiceNo }}
       
      />
    </>
  );
};

export default ActionMenu;

export const columnDefs: ColDef<RowData>[] = [
  {
    headerName: "Actions",
    maxWidth: 100,
    cellRenderer: (params: any) => {
      return <ActionMenu row={params.data} />;
    },
  },
  {
    headerName: "#",
    valueGetter: "node.rowIndex + 1",
    maxWidth: 50,
    filter: false,
  },
  {
    headerName: "SO Invoice ID",
    field: "invoiceNo",
    filter: "agNumberColumnFilter",
  },
  {
    headerName: "Shipment ID",
    field: "shipmentId",
    filter: "agNumberColumnFilter",
  },
  {
    headerName: "Invoice Status",
    field: "invStatus",
    filter: "agDateColumnFilter",
  },
  {
    headerName: "Customer Name",
    field: "custName",
    filter: "agDateColumnFilter",
    width: 300,
  },
  {
    headerName: "Supplier Name",
    field: "supplier",
    filter: "agTextColumnFilter",
    width: 280,
  },
  {
    headerName: "e-wayBill Created",
    field: "ewaybill",
    valueGetter: (params) => (params?.data?.ewaybill === "N" ? "No" : "Yes"),
  },
  {
    headerName: "e-Invoice Created",
    field: "eInvoice",
    valueGetter: (params) => (params?.data?.eInvoice === "N" ? "No" : "Yes"),
  },
  {
    headerName: "Create Date",
    field: "createDate",
    filter: "agTextColumnFilter",
  },
  {
    headerName: "Create By",
    field: "createBy",
    filter: "agTextColumnFilter",
    width: 200,
  },
];