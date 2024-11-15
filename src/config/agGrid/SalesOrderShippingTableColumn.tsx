import { RowData } from "@/types/SalesOrderRegisterType";
import { ColDef } from "ag-grid-community";
import { MoreOutlined } from "@ant-design/icons";
import { Button, Menu, Dropdown, Form } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useEffect, useState } from "react";
// import { printFunction } from "@/General";
import { ConfirmCancellationDialog } from "@/config/agGrid/registerModule/ConfirmCancellationDialog";
import { CreateInvoiceDialog } from "@/config/agGrid/registerModule/CreateInvoiceDialog";
import { printSellOrder } from "@/features/salesmodule/SalesSlice";
import { printFunction } from "@/components/shared/PrintFunctions";
import MaterialListModal from "@/config/agGrid/registerModule/MaterialListModal";
import {
  approveShipment,
  cancelShipment,
  createInvoice,
  fetchMaterialList,
  fetchSalesOrderShipmentList,
} from "@/features/salesmodule/salesShipmentSlice";
import { TruncateCellRenderer } from "@/General";
import PickSlipModal from "@/config/agGrid/PickSlipModal";
import CopyCellRenderer from "@/components/shared/CopyCellRenderer";

interface ActionMenuProps {
  row: RowData; // Use the RowData type here
}

const ActionMenu: React.FC<ActionMenuProps> = ({ row }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isInvoiceModalVisible, setIsInvoiceModalVisible] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isMaterialListModalVisible, setIsMaterialListModalVisible] =
    useState(false);
  const [form] = Form.useForm();
  const [invoiceForm] = Form.useForm(); // Form instance for the invoice modal
  const { loading } = useSelector((state: RootState) => state.sellRequest);

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

  const handleshowMaterialListForApprove = (row: RowData) => {
    dispatch(fetchMaterialList({ shipment_id: row?.shipment_id }));
    setShowConfirmationModal(true);
  };

  const confirmApprove = () => {
    dispatch(approveShipment({ so_id: row?.shipment_id })).then(
      (response: any) => {
        if (response?.payload?.code == 200) {
          dispatch(
            fetchSalesOrderShipmentList({
              type: "date_wise",
              data: dateRange,
            }) as any
          );
        }
      }
    );
    setShowConfirmationModal(false);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const payload = {
          cancelReason: values.remark,
          shipment_id: row?.shipment_id,
        };
        dispatch(cancelShipment(payload)).then((response: any) => {
          console.log(response);
          if (response?.payload?.code == 200) {
            form.resetFields(); // Clear the form fields after submission
            dispatch(
              fetchSalesOrderShipmentList({
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
          shipment_id: row?.shipment_id,
          remark: values.remark,
          so_id: row?.so_id,
        };
        dispatch(createInvoice(payload)).then((resultAction: any) => {
          if (resultAction.payload?.code == 200) {
            setIsInvoiceModalVisible(false);
            dispatch(
              fetchSalesOrderShipmentList({
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

  useEffect(() => {
    if (submitSuccess) {
      dispatch(
        fetchSalesOrderShipmentList({
          type: "date_wise",
          data: dateRange,
        }) as any
      );
    }
  }, [submitSuccess]);

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

  const materialListColumns: ColDef[] = [
    { headerName: "#", valueGetter: "node.rowIndex + 1", maxWidth: 50 },
    {
      headerName: "Item",
      field: "item",
    },
    {
      headerName: "Item Name",
      field: "itemName",
      width: 200,
      cellRenderer: TruncateCellRenderer,
    },
    {
      headerName: "Item Description",
      field: "itemSpecification",
      autoHeight: true,
      width: 300,
    },
    { headerName: "Item Part Number", field: "itemPartNo" },
    { headerName: "Qty", field: "qty" },
    { headerName: "Rate", field: "rate" },
    { headerName: "GST Rate", field: "gstRate" },
    { headerName: "UOM", field: "uom" },
    { headerName: "Hsn Code", field: "hsnCode" },
    { headerName: "CGST Rate", field: "cgstRate" },
    { headerName: "SGST Rate", field: "sgstRate" },
    { headerName: "IGST Rate", field: "igstRate" },
    { headerName: "Remark", field: "itemRemark" },
  ];

  const isDisabled = row?.approval_status === "N";

  const menu = (
    <Menu>
      <Menu.Item
        key="approve"
        onClick={() => handleshowMaterialListForApprove(row)}
      >
        View/Approve
      </Menu.Item>
      <Menu.Item key="cancel" onClick={showCancelModal}>
        Cancel
      </Menu.Item>
      <Menu.Item
        key="update"
        onClick={() => {
          handleshowMaterialList(row);
        }}
        disabled={row?.approval_status === "P"}
      >
        PickSlip
      </Menu.Item>
      <Menu.Item
        key="createInvoice"
        onClick={showInvoiceModal}
        disabled={isDisabled || row?.material_status !== "OUT"}
      >
        Create Invoice
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
        module="Shipment "
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
      <PickSlipModal
        visible={isMaterialListModalVisible}
        onClose={handleMaterialListModalClose}
        sellRequestDetails={shipmentMaterialList}
        row={{ req_id: row?.so_id }}
        loading={loading2}
        setSubmitSuccess={setSubmitSuccess}
      />
      <MaterialListModal
        visible={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        sellRequestDetails={shipmentMaterialList?.items}
        row={{ req_id: row?.so_id }}
        loading={loading2}
        columnDefs={materialListColumns}
        title={`Approve Shipment Order for ${row?.shipment_id}`}
        submitText="Approve"
        handleSubmit={confirmApprove}
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
    headerName: "Shipment ID",
    field: "shipment_id",
    filter: "agTextColumnFilter",
  },
  {
    headerName: "Shipment Date",
    field: "shipment_date",
    filter: "agNumberColumnFilter",
  },
  { headerName: "SO ID", field: "so_id", filter: "agTextColumnFilter" },
  {
    headerName: "PO Number",
    field: "po_number",
    filter: "agTextColumnFilter",
  },
  {
    headerName: "PO Date",
    field: "po_date",
    filter: "agDateColumnFilter",
  },
  {
    headerName: "Pickslip ID",
    field: "pickslip_id",
    filter: "agTextColumnFilter",
    cellRenderer:CopyCellRenderer
  },
  {
    headerName: "Approval Status",
    field: "approval_status",
    valueGetter: (params) =>
      params?.data?.approval_status === "A" ? "Approved" : "Pending",
  },
  {
    headerName: "Shipment Status",
    field: "shipment_status",
    valueGetter: (params) =>
      params?.data?.shipment_status === "Y"
        ? "Active"
        : params?.data?.shipment_status === "C"
        ? "Cancelled"
        : "Pending",
  },
  {
    headerName: "Material Status",
    field: "material_status",
    filter: "agTextColumnFilter",
    valueGetter: (params) =>
      params?.data?.material_status === "Y" ? "Out" : "Pending",
  },
  {
    headerName: "SuplierName",
    field: "SuplierName",
    filter: "agTextColumnFilter",
  },
  {
    headerName: "Supplier Address",
    field: "supplierAddress",
    cellRenderer: "truncateCellRenderer",
  },
  { headerName: "Client", field: "clientName", filter: "agTextColumnFilter" },
  {
    headerName: "Client Address",
    field: "clientAddress",
    filter: "agTextColumnFilter",
    cellRenderer:"truncateCellRenderer"
  },
 
];
