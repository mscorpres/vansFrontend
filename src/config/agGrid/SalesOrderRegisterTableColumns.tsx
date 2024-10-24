import { RowData } from "@/types/SalesOrderRegisterType";
import { ColDef } from "ag-grid-community";
import { MoreOutlined } from "@ant-design/icons";
import { Button, Menu, Dropdown, Form } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useState } from "react";
import MaterialListModal from "@/config/agGrid/registerModule/MaterialListModal";
// import { printFunction } from "@/General";
import { ConfirmCancellationDialog } from "@/config/agGrid/registerModule/ConfirmCancellationDialog";
import { CreateInvoiceDialog } from "@/config/agGrid/registerModule/CreateInvoiceDialog";
import CopyCellRenderer from "@/components/shared/CopyCellRenderer";
import { toast } from "@/components/ui/use-toast";

interface ActionMenuProps {
  row: RowData; // Use the RowData type here
}

const ActionMenu: React.FC<ActionMenuProps> = ({ row }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isInvoiceModalVisible, setIsInvoiceModalVisible] = useState(false);
  const [isMaterialListModalVisible, setIsMaterialListModalVisible] =
    useState(false);
  const [date, setDate] = useState("");
  const [form] = Form.useForm();
  const [invoiceForm] = Form.useForm(); // Form instance for the invoice modal
  const { sellRequestDetails,loading } = useSelector(
    (state: RootState) => state.sellRequest
  );
  const dateRange = useSelector(
    (state: RootState) => state.sellRequest.dateRange
  );

  const handleUpdate = (row: any) => {
    const soId = row?.req_id; // Replace with actual key for employee ID
    window.open(`/sales/order/update/${soId.replaceAll("/", "_")}`, "_blank");
    // dispatch(fetchDataForUpdate({ clientCode: soId }));
  };

  const showCancelModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleMaterialListModalClose = () =>
    setIsMaterialListModalVisible(false);

  const handleshowMaterialList = (row: RowData) => {
    // dispatch(fetchSellRequestDetails({ req_id: row?.req_id }));
    setIsMaterialListModalVisible(true);
  };

  const handleOk = () => {
    // form
    //   .validateFields()
    //   .then((values) => {
    //     const payload = {
    //       remark: values.remark,
    //       so: row?.req_id,
    //     };
    //     dispatch(cancelSalesOrder(payload)).then((response: any) => {
    //       if (response?.payload?.success) {
    //         form.resetFields(); // Clear the form fields after submission
    //         dispatch(
    //           fetchSellRequestList({ wise: "DATE", data: dateRange }) as any
    //         );
    //       }
    //     });
    //     setIsModalVisible(false);
    //   })
    //   .catch((errorInfo) => {
    //     console.error("Validation Failed:", errorInfo);
    //   });
  };
  const showInvoiceModal = () => {
    setIsInvoiceModalVisible(true);
  };
  const handleInvoiceModalOk = () => {
    // invoiceForm
    //   .validateFields()
    //   .then((values) => {
    //     const payload: any = {
    //       bill_id: row.bill_id,
    //       client_addr_id: row.client_addr_id,
    //       client_id: row.customer_code,
    //       invoice_no: values.invoice_no,
    //       invoice_date: date,
    //       nos_of_boxes: values.nos_of_boxes,
    //       remark: values.remark,
    //       shipment_id: [row?.req_id],
    //       so_id: [row?.req_id],
    //     };
    //     dispatch(createInvoice(payload)).then((resultAction: any) => {
    //       if (resultAction.payload?.success) {
    //         setIsInvoiceModalVisible(false);
    //         toast({
    //           title:
    //             typeof resultAction?.payload?.message === "string"
    //               ? resultAction?.payload?.message
    //               : JSON.stringify(resultAction?.payload?.message),
    //           className: "bg-green-600 text-white items-center",
    //         });
    //       } else {
    //         toast({
    //           title:
    //             typeof resultAction?.error?.message === "string"
    //               ? resultAction?.error?.message
    //               : JSON.stringify(resultAction?.error?.message),
    //           className: "bg-red-600 text-white items-center",
    //         });
    //       }
    //     });
    //     dispatch(
    //       fetchSellRequestList({ wise: "DATE", data: dateRange }) as any
    //     );
    //     invoiceForm.resetFields();
    //   })
    //   .catch((errorInfo) => {
    //     console.error("Validation Failed:", errorInfo);
    //   });
  };

  const handleInvoiceModalCancel = () => {
    setIsInvoiceModalVisible(false);
  };

  const handlePrintOrder = async (orderId: string) => {
    // dispatch(printSellOrder({ so_id: orderId })).then((response: any) => {
    //   if (response?.payload?.success) {
    //     printFunction(response?.payload?.data.buffer.data);
    //   }
    // });
  };

  const isDisabled = row?.hasInvoice === true || row?.status === "Cancelled";

  const menu = (
    <Menu>
      <Menu.Item
        key="update"
        onClick={() => handleUpdate(row)}
        disabled={isDisabled}
      >
        Update
      </Menu.Item>
      <Menu.Item key="cancel" onClick={showCancelModal} disabled={isDisabled}>
        Approve
      </Menu.Item>
      <Menu.Item key="cancel" onClick={showCancelModal} disabled={isDisabled}>
        Cancel
      </Menu.Item>
      <Menu.Item key="materialList" onClick={() => handleshowMaterialList(row)}>
        Material List
      </Menu.Item>
      <Menu.Item
        key="createInvoice"
        onClick={showInvoiceModal}
        disabled={isDisabled}
      >
        Create Invoice
      </Menu.Item>
      <Menu.Item key="print" onClick={() => handlePrintOrder(row?.req_id)}>
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
        isDialogVisible={isModalVisible}
        handleOk={handleOk}
        handleCancel={handleCancel}
        row={{ req_id: row?.req_id }}
        form={form}
        loading={loading}
      />
      <CreateInvoiceDialog
        isDialogVisible={isInvoiceModalVisible}
        handleOk={handleInvoiceModalOk}
        handleCancel={handleInvoiceModalCancel}
        row={{ req_id: row?.req_id }}
        form={invoiceForm}
        setDate={setDate}
        loading={loading}
      />
      {/* <MaterialListModal
        visible={isMaterialListModalVisible}
        onClose={handleMaterialListModalClose}
        sellRequestDetails={sellRequestDetails}
        row={{ req_id: row?.req_id }}
        loading={loading}
      /> */}
    </>
  );
};

export default ActionMenu;

export const columnDefs: ColDef<any>[] = [
  {
    headerName: "Actions",
    maxWidth: 100,
    cellRenderer: (params: any) => <ActionMenu row={params.data} />,
  },
  { headerName: "#", valueGetter: "node.rowIndex + 1", maxWidth: 50,filter: false},

  {
    headerName: "SO ID",
    field: "so_id",
    filter: "agTextColumnFilter",
    cellRenderer: CopyCellRenderer,
  },
  { headerName: "Status", field: "soStatus", filter: "agTextColumnFilter" },
  { headerName: "SO Invoice Status", field: "soInvoiceStatus", filter: "agTextColumnFilter" },
  { headerName: "Approve Status", field: "approveStatus", filter: "agTextColumnFilter" },
  {
    headerName: "Customer Name",
    field: "clintname",
    filter: "agTextColumnFilter",
    cellRenderer: CopyCellRenderer,
  },
  {
    headerName: "Supplier Name",
    field: "supplierName",
    filter: "agTextColumnFilter",
    cellRenderer: CopyCellRenderer,
  },
  {
    headerName: "Created Date",
    field: "createDate",
    filter: "agTextColumnFilter",
  },
  {
    headerName: "Created By",
    field: "createBy",
    filter: "agTextColumnFilter",
  },
];
