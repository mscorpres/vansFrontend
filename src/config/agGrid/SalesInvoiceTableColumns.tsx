import { RowData } from "@/types/SalesInvoiceTypes";
import { ColDef } from "ag-grid-community";
import { Button, Dropdown, Form } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { cancelInvoice, fetchInvoiceDetail, fetchSalesOrderInvoiceList, printSellInvoice } from "@/features/salesmodule/salesInvoiceSlice";
import { AppDispatch, RootState } from "@/store";
import { useState } from "react";
import { ConfirmCancellationDialog } from "@/config/agGrid/registerModule/ConfirmCancellationDialog";
import CopyCellRenderer from "@/components/shared/CopyCellRenderer";
import ViewInvoiceModal from "@/config/agGrid/salesmodule/ViewInvoiceModal";
import { printFunction } from "@/components/shared/PrintFunctions";

const ActionMenu: React.FC<any> = ({ row }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [viewInvoice, setViewInvoice] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { challanDetails, loading }: any = useSelector(
    (state: RootState) => state.sellInvoice
  );
  const dateRange = useSelector(
    (state: RootState) => state.sellRequest.dateRange
  );

  const handleViewInvoice = (row: any) => {
    setViewInvoice(true);
    dispatch(fetchInvoiceDetail({ invoiceNo: row.invoiceNo }));
  };

const handlePrintInvoice = async (orderId: string) => {
    dispatch(
      printSellInvoice({ invoiceNo: orderId, })
    ).then((response: any) => {
      if (response?.payload?.success) {
        printFunction(response?.payload?.data.buffer.data);
      }
    })
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
    headerName: "SO ID",
    field: "soId",
    filter: "agNumberColumnFilter",
    cellRenderer: CopyCellRenderer,
  },
  {
    headerName: "SO Invoice ID",
    field: "invoiceNo",
    filter: "agNumberColumnFilter",
    cellRenderer: CopyCellRenderer,
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
    cellRenderer: CopyCellRenderer,
  },
  {
    headerName: "Supplier Name",
    field: "suplier",
    filter: "agTextColumnFilter",
    cellRenderer: CopyCellRenderer,
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
    cellRenderer: CopyCellRenderer,
  },
  {
    headerName: "Create By",
    field: "createBy",
    filter: "agTextColumnFilter",
    width: 200,
  },
];
