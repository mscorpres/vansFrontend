import { RowData } from "@/types/SalesOrderRegisterType";
import { ColDef } from "ag-grid-community";
import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined, FileAddOutlined, MoreOutlined, PrinterOutlined } from "@ant-design/icons";
import { Button, Menu, Dropdown, Form } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useEffect, useState } from "react";
import { ConfirmCancellationDialog } from "@/config/agGrid/registerModule/ConfirmCancellationDialog";
import { printShipment } from "@/features/salesmodule/SalesSlice";
import { printFunction } from "@/components/shared/PrintFunctions";
import MaterialListModal from "./MaterialListModal";
import { approveShipment, cancelShipment, createInvoice, fetchMaterialList, fetchSalesOrderShipmentList } from "@/features/salesmodule/salesShipmentSlice";
import { TruncateCellRenderer } from "@/General";
import PickSlipModal from "@/config/agGrid/PickSlipModal";
import { toast } from "react-toastify";
import ViewAndCreateInvModal from "@/config/agGrid/salesmodule/ViewandCreateInvModal";

interface ActionMenuProps {
  row: RowData;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ row }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isInvoiceModalVisible, setIsInvoiceModalVisible] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isMaterialListModalVisible, setIsMaterialListModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [invoiceForm] = Form.useForm();
  const { loading } = useSelector((state: RootState) => state.sellRequest);
  const { shipmentMaterialList, loading: loading2 } = useSelector((state: RootState) => state.sellShipment);

  const dateRange = useSelector((state: RootState) => state.sellRequest.dateRange);

  const showCancelModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleMaterialListModalClose = () => setIsMaterialListModalVisible(false);

  const handleshowMaterialList = (row: RowData) => {
    dispatch(fetchMaterialList({ shipment_id: row?.shipment_id }));
    setIsMaterialListModalVisible(true);
  };

  const handleshowMaterialListForApprove = (row: RowData) => {
    dispatch(fetchMaterialList({ shipment_id: row?.shipment_id }));
    setShowConfirmationModal(true);
  };

  const confirmApprove = () => {
    dispatch(approveShipment({ so_id: row?.shipment_id })).then((response: any) => {
      if (response?.payload?.code === 200 || response?.payload?.success) {
        toast.success(response?.payload?.message);
        dispatch(
          fetchSalesOrderShipmentList({
            type: "date_wise",
            data: dateRange,
          }) as any
        );
      }
    });
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
          if (response?.payload?.code === 200 || response?.payload?.success) {
            form.resetFields();
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
    dispatch(fetchMaterialList({ shipment_id: row?.shipment_id })).then((response: any) => {
      if (response?.payload?.success && response?.payload?.data) {
        const fetchedData = response.payload.data;
        const sellRequestDetails = {
          headerData: {
            soId: row?.so_id, // Still using row.so_id as it may be needed
            invoiceNo: fetchedData.header.shipment_id,
            billTo: {
              custName: fetchedData.header.customer_name.customer_name,
              pincode: fetchedData.header.bill_to.pincode,
              panno: fetchedData.header.bill_to.panno,
              gst: fetchedData.header.bill_to.gstno,
              address1: fetchedData.header.bill_to.address,
              address2: "",
            },
            shipTo: {
              company: fetchedData.header.ship_to.company,
              panno: fetchedData.header.ship_to.panno,
              gst: fetchedData.header.ship_to.gstno,
              pincode: fetchedData.header.ship_to.pincode,
              address1: fetchedData.header.ship_to.address1,
              address2: fetchedData.header.ship_to.address2,
            },
            billFrom: {
              pan: fetchedData.header.bill_from.panno,
              gstin: fetchedData.header.bill_from.gstno,
              address1: fetchedData.header.bill_from.address1,
              address2: fetchedData.header.bill_from.address2,
            },
            ewaybill: "No",
            eInvoice: "No",
            invStatus: row?.shipment_status === "Y" ? "Active" : "Pending", // Still using row.shipment_status
            createDate: row?.shipment_date, // Still using row.shipment_date
          },
          materialData: fetchedData.items || [],
        };
        console.log("sellRequestDetails:", sellRequestDetails);
        setIsInvoiceModalVisible(true);
        // Store sellRequestDetails in state to pass to modal
        setInvoiceModalData(sellRequestDetails);
      } else {
        toast.error("Failed to fetch material list.");
      }
    });
  };

  const [invoiceModalData, setInvoiceModalData] = useState<any>(null);

  const handleInvoiceModalOk = (values: any) => {
    const payload = {
      shipment_id: row?.shipment_id,
      so_id: row?.so_id,
      costcenter: row?.costcenter,
      boxes: values.boxes,
      remark: values.remark,
      freightCharges: values.freightCharges,
      gstRateFreight: values.gstRateFreight,
      documentType: values.documentType,
      supplyType: values.supplyType,
      supplyTypeEW: values.supplyTypeW,
      transactionType: values.transactionType,
      reverseCharge: values.reverseCharge,
      igstOnIntra: values.igstOnIntra,
      billFromLocation: values.billFromLocation,
      billToLocation: values.billToLocation,
      dispatchFromLocation: values.dispatchFromLocation,
      shipToLocation: values.shipToLocation,
      dispatchDocNo: values.dispatchDocNo,
      dispatchThrough: values.dispatchThrough,
      deliveryNote: values.deliveryNote,
      deliveryDate: values.deliveryDate,
      transporterMode: values.transporterMode,
      vehicleType: values.vehicleType,
      vehicleNo: values.vehicleNo,
      transportDoc: values.transportDoc,
      transporterName: values.transporterName,
      transporterId: values.transporterId,

    };

    dispatch(createInvoice(payload)).then((resultAction: any) => {
      if (resultAction.payload?.code === 200 || resultAction.payload?.success) {
        setIsInvoiceModalVisible(false);
        dispatch(
          fetchSalesOrderShipmentList({
            type: "date_wise",
            data: dateRange,
          }) as any
        );
        invoiceForm.resetFields();
        toast.success("Invoice created successfully!");
      } else {
        toast.error("Failed to create invoice.");
      }
    });
  };

  const handleInvoiceModalCancel = () => {
    setIsInvoiceModalVisible(false);
    invoiceForm.resetFields();
  };

  const handlePrintInvoice = (invoiceNo: string, printType: string) => {
    dispatch(printShipment({ shipment_id: row?.shipment_id })).then((response: any) => {
      if (response?.payload?.success) {
        printFunction(response?.payload?.data.buffer.data);
      }
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

  const materialListColumns: ColDef[] = [
    { headerName: "#", valueGetter: "node.rowIndex + 1", maxWidth: 50 },
    { headerName: "Part No.", field: "itemPartNo" },
    {
      headerName: "Name",
      field: "itemName",
      width: 200,
      cellRenderer: TruncateCellRenderer,
    },
    {
      headerName: "Description",
      field: "itemSpecification",
      autoHeight: true,
      width: 300,
    },
    {
      headerName: "Customer Part Number",
      field: "customer_part_no",
      cellRenderer: TruncateCellRenderer,
    },
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
      <Menu.Item key="approve" onClick={() => handleshowMaterialListForApprove(row)} icon={<CheckCircleOutlined className="text-base" />}>
        View/Approve
      </Menu.Item>
      <Menu.Item key="cancel" onClick={showCancelModal} icon={<CloseCircleOutlined className="text-base" />}>
        Cancel
      </Menu.Item>
      <Menu.Item
        key="update"
        onClick={() => handleshowMaterialList(row)}
        // disabled={row?.approval_status === "P" || row?.material_status === "Y"}
        icon={<EditOutlined className="text-base" />}
      >
        PickSlip
      </Menu.Item>
      <Menu.Item key="createInvoice" onClick={showInvoiceModal} disabled={isDisabled || row?.material_status !== "Y"} icon={<FileAddOutlined className="text-base" />}>
        Create Invoice
      </Menu.Item>
      <Menu.Item key="print" onClick={() => handlePrintInvoice(row?.shipment_id, "Original")} icon={<PrinterOutlined className="text-base" />}>
        Print
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Dropdown overlay={menu} trigger={["click"]}>
        <Button icon={<MoreOutlined />} />
      </Dropdown>
      <ConfirmCancellationDialog isDialogVisible={isModalVisible} handleOk={handleOk} handleCancel={handleCancel} row={{ req_id: row?.so_id }} form={form} loading={loading} module="Shipment" />
      <ViewAndCreateInvModal
        visible={isInvoiceModalVisible}
        onClose={handleInvoiceModalCancel}
        sellRequestDetails={invoiceModalData}
        loading={loading || loading2}
        form={invoiceForm}
        onSave={handleInvoiceModalOk}
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
        loading={loading2 || loading}
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
  },
  {
    headerName: "Approval Status",
    field: "approval_status",
    valueGetter: (params) => (params?.data?.approval_status === "A" ? "Approved" : "Pending"),
  },
  {
    headerName: "Shipment Status",
    field: "shipment_status",
    valueGetter: (params) => (params?.data?.shipment_status === "Y" ? "Active" : params?.data?.shipment_status === "C" ? "Cancelled" : "Pending"),
  },
  {
    headerName: "Material Status",
    field: "material_status",
    filter: "agTextColumnFilter",
    valueGetter: (params) => (params?.data?.material_status === "Y" ? "Out" : "Pending"),
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
    cellRenderer: "truncateCellRenderer",
  },
];
