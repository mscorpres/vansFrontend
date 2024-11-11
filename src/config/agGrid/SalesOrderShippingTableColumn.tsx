import { RowData } from "@/types/SalesOrderRegisterType";
import { ColDef } from "ag-grid-community";
import { MoreOutlined } from "@ant-design/icons";
import { Button, Menu, Dropdown, Form } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useState } from "react";
// import { printFunction } from "@/General";
import { ConfirmCancellationDialog } from "@/config/agGrid/registerModule/ConfirmCancellationDialog";
import { CreateInvoiceDialog } from "@/config/agGrid/registerModule/CreateInvoiceDialog";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import {
  approveSo,
  cancelSalesOrder,
  createInvoice,
  createShipment,
  fetchSellRequestList,
  printSellOrder,
} from "@/features/salesmodule/SalesSlice";
import { printFunction } from "@/components/shared/PrintFunctions";
import MaterialListModal from "@/config/agGrid/registerModule/MaterialListModal";
import { fetchMaterialList } from "@/features/salesmodule/salesShipmentSlice";

interface ActionMenuProps {
  row: RowData; // Use the RowData type here
}

const ActionMenu: React.FC<ActionMenuProps> = ({ row }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isInvoiceModalVisible, setIsInvoiceModalVisible] = useState(false);
  const [isMaterialListModalVisible, setIsMaterialListModalVisible] =
    useState(false);
  const [form] = Form.useForm();
  const [invoiceForm] = Form.useForm(); // Form instance for the invoice modal
  const { sellRequestList, loading } = useSelector(
    (state: RootState) => state.sellRequest
  );

  const { shipmentMaterialList, loading: loading2 } = useSelector(
    (state: RootState) => state.sellShipment
  );

  const dateRange = useSelector(
    (state: RootState) => state.sellRequest.dateRange
  );

  const showCancelModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleMaterialListModalClose = () =>
    setIsMaterialListModalVisible(false);

  const handleshowMaterialList = (row: RowData) => {
    dispatch(fetchMaterialList({ shipment_id: row?.shipment_id }));
    setIsMaterialListModalVisible(true);
  };

  const confirmApprove = () => {
    dispatch(approveSo({ so_id: row?.shipment_id }));
    setShowConfirmationModal(false);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const payload = {
          cancelReason: values.remark,
          so_id: row?.so_id,
        };
        dispatch(cancelSalesOrder(payload)).then((response: any) => {
          console.log(response);
          if (response?.payload?.code == 200) {
            form.resetFields(); // Clear the form fields after submission
            dispatch(
              fetchSellRequestList({
                type: "date_wise",
                data: dateRange,
              }) as any
            );
          }
        });
        setIsModalVisible(false);
      })
      .catch((errorInfo) => {
        console.error("Validation Failed:", errorInfo);
      });
  };
  const showInvoiceModal = () => {
    setIsInvoiceModalVisible(true);
  };
  const handleInvoiceModalOk = () => {
    invoiceForm
      .validateFields()
      .then((values) => {
        const payload: any = {
          so_id: row?.so_id,
          remark: values.remark,
        };
        dispatch(createInvoice(payload)).then((resultAction: any) => {
          if (resultAction.payload?.success) {
            setIsInvoiceModalVisible(false);
            dispatch(
              fetchSellRequestList({
                type: "date_wise",
                data: dateRange,
              }) as any
            );
          }
        });

        invoiceForm.resetFields();
      })
      .catch((errorInfo) => {
        console.error("Validation Failed:", errorInfo);
      });
  };

  const handleInvoiceModalCancel = () => {
    setIsInvoiceModalVisible(false);
  };

  const handlePrintOrder = async (orderId: string) => {
    dispatch(printSellOrder({ so_id: orderId })).then((response: any) => {
      if (response?.payload?.success) {
        printFunction(response?.payload?.data.buffer.data);
      }
    });
  };

  const isDisabled = row?.approveStatus === "Approved";

  const menu = (
    <Menu>
      <Menu.Item
        key="approve"
        onClick={() => setShowConfirmationModal(true)}
        disabled={isDisabled}
      >
        Approve
      </Menu.Item>
      <Menu.Item
        key="update"
        onClick={() => {
          handleshowMaterialList(row);
        }}
        disabled={isDisabled}
      >
        Material Out
      </Menu.Item>
      <Menu.Item key="cancel" onClick={showCancelModal} disabled={isDisabled}>
        Cancel
      </Menu.Item>
      <Menu.Item
        key="createInvoice"
        onClick={showInvoiceModal}
        disabled={isDisabled}
      >
        Create Invoice
      </Menu.Item>
      <Menu.Item key="print" onClick={() => handlePrintOrder(row?.so_id)}>
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
        row={{ req_id: row?.so_id }}
        form={form}
        loading={loading}
      />
      <CreateInvoiceDialog
        isDialogVisible={isInvoiceModalVisible}
        handleOk={handleInvoiceModalOk}
        handleCancel={handleInvoiceModalCancel}
        form={invoiceForm}
        loading={loading}
        heading="Create Invoice"
        description={`Are you sure you want to create an invoice for SO ${row.so_id} and shipment ${row.shipment_id}?`}
      />
      <MaterialListModal
        visible={isMaterialListModalVisible}
        onClose={handleMaterialListModalClose}
        sellRequestDetails={shipmentMaterialList}
        row={{ req_id: row?.so_id }}
        loading={loading2}
      />
      <ConfirmationModal
        open={showConfirmationModal}
        onOkay={confirmApprove}
        onClose={() => setShowConfirmationModal(false)}
        title="Confirm Approve!"
        description={`Are you sure you want to approve this shipment ${row?.shipment_id}?`}
      />
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
  {
    headerName: "ID",
    field: "id",
    filter: "agNumberColumnFilter",
    maxWidth: 100,
  },
  {
    headerName: "Shipment ID",
    field: "shipment_id",
    filter: "agTextColumnFilter",
  },
  { headerName: "SO ID", field: "so_id", filter: "agTextColumnFilter" },
  {
    headerName: "Item Part Code",
    field: "item_part_no",
    filter: "agTextColumnFilter",
  },
  {
    headerName: "Item Part Name",
    field: "item_name",
    filter: "agTextColumnFilter",
  },
  { headerName: "Item Qty", field: "item_qty", filter: "agNumberColumnFilter" },
  {
    headerName: "Item Rate",
    field: " item_rate",
    filter: "agNumberColumnFilter",
  },
  {
    headerName: "Shipment Date",
    field: "shipment_dt",
    filter: "agDateColumnFilter",
  },
  {
    headerName: "Client Code",
    field: "client_code",
    filter: "agTextColumnFilter",
  },
  { headerName: "Client", field: "client", filter: "agTextColumnFilter" },
  {
    headerName: "Client Address",
    field: "clientaddress",
    filter: "agTextColumnFilter",
  },
  {
    headerName: "Billing Name",
    field: "billing_name",
    filter: "agTextColumnFilter",
  },
  {
    headerName: "Billing Address",
    field: "billingaddress1",
    filter: "agTextColumnFilter",
  },
  {
    headerName: "Shipping Name",
    field: "shipping_id",
    filter: "agTextColumnFilter",
  },
  {
    headerName: "Shipping Address",
    field: "shippingaddress1",
    filter: "agTextColumnFilter",
  },
  {
    headerName: "Status",
    field: "shipment_status",
    filter: "agTextColumnFilter",
  },
];
