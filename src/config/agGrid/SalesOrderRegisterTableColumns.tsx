import { RowData } from "@/types/SalesOrderRegisterType";
import { ColDef } from "ag-grid-community";
import { CarOutlined, CheckCircleOutlined, CloseCircleOutlined, EditOutlined, MoreOutlined, PrinterOutlined, StopOutlined } from "@ant-design/icons";
import { Button, Menu, Dropdown, Form } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useMemo, useState } from "react";
import CreateShipmentListModal from "@/config/agGrid/registerModule/CreateShipmentListModal";
import { ConfirmCancellationDialog } from "@/config/agGrid/registerModule/ConfirmCancellationDialog";
import { CreateInvoiceDialog } from "@/config/agGrid/registerModule/CreateInvoiceDialog";
import { approveSo, cancelSalesOrder, createShipment, fetchMaterialList, fetchSellRequestList, printSellOrder, rejectSo, shortClose } from "@/features/salesmodule/SalesSlice";
import { printFunction } from "@/components/shared/PrintFunctions";
import { useToast } from "@/components/ui/use-toast";
import MaterialListModal from "./MaterialListModal";
import { TruncateCellRenderer } from "@/General";
import { useNavigate } from "react-router-dom"; 

interface ActionMenuProps {
  row: RowData; 
}

const ActionMenu: React.FC<ActionMenuProps> = ({ row }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate(); 
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isMaterialListModalVisible, setIsMaterialListModalVisible] = useState(false);
  const [showHandleCloseModal, setShowHandleCloseModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [form] = Form.useForm();
  const [shortCloseForm] = Form.useForm(); // Form instance for the invoice modal
  const [rejectform] = Form.useForm(); // Form instance for the invoice modal
  const { sellRequestList, loading } = useSelector((state: RootState) => state.sellRequest);
  const dateRange = useSelector((state: RootState) => state.sellRequest.dateRange);
  const { toast } = useToast();
  const handleUpdate = (row: any) => {
    const soId = row?.so_id;
    window.open(`/sales/order/update/${soId.replaceAll("/", "_")}`, "_blank");
    // dispatch(fetchDataForUpdate({ clientCode: soId }));
  };

  const showCancelModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleMaterialListModalClose = () => setIsMaterialListModalVisible(false);
  // dispatch(fetchSellRequestList({ type: "date_wise", data: dateRange }) as any);

  const handleshowMaterialList = (row: RowData) => {
    dispatch(fetchMaterialList({ so_id: row?.so_id }));
    setIsMaterialListModalVisible(true);
  };

  // const handleshowMaterialListForApprove = (row: RowData) => {
  //   dispatch(fetchMaterialList({ so_id: row?.so_id }));
  //   setShowConfirmationModal(true);
  // };
  const handleshowMaterialListForApprove = (row: RowData) => {
    // CHANGE: Navigate to the new approval page instead of opening modal
      const url = `/sales/order/approve?so_id=${encodeURIComponent(row?.so_id)}`;
     window.open(url, "_blank");
     
  };

  // const confirmApprove = () => {
  //   dispatch(approveSo({ so_id: row?.so_id })).then((response: any) => {
  //     if (response?.payload?.code == 200 || response?.payload?.success || response?.payload?.status == success) {
  //       toast({
  //         className: "bg-green-600 text-white items-center",
  //         description: response.payload.message || "Sales Order Approved successfully",
  //       });
  //       dispatch(fetchSellRequestList({ type: "date_wise", data: dateRange }) as any);
  //     }
  //   });
  //   setShowConfirmationModal(false);
  // };

  const handleOkReject = () => {
    rejectform
      .validateFields()
      .then((values) => {
        const payload = {
          remark: values.remark || "",
          so_id: row?.so_id,
        };
        dispatch(rejectSo(payload) as any).then((response: any) => {
          if (response?.payload?.code == 200 || response?.payload?.success) {
            rejectform.resetFields();
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

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const payload = {
          cancelReason: values.remark,
          so_id: row?.so_id,
        };
        dispatch(cancelSalesOrder(payload)).then((response: any) => {
          if (response?.payload?.code == 200 || response?.payload?.success) {
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

  const handlePrintOrder = async (orderId: string) => {
    dispatch(printSellOrder({ so_id: orderId })).then((response: any) => {
      if (response?.payload?.success) {
        printFunction(response?.payload?.data.buffer.data);
      }
    });
  };

  const onCreateShipment = (payload: any) => {
    dispatch(createShipment(payload)).then((response: any) => {
      if (response?.payload?.success) {
        toast({
          className: "bg-green-600 text-white items-center",
          description: response.payload.message,
        });
        setIsMaterialListModalVisible(false);
        handleMaterialListModalClose();
        dispatch(fetchSellRequestList({ type: "date_wise", data: dateRange }) as any);
      }
    });
  };

  const handleShortClose = () => {
    setShowHandleCloseModal(true);
  };

  const handleShortCloseModalOk = () => {
    shortCloseForm.validateFields().then((values) => {
      const payload: any = {
        so_id: row?.so_id,
        remark: values.remark,
      };
      dispatch(shortClose(payload)).then((response: any) => {
        if (response?.payload?.code == 200 || response?.payload?.success) {
          setShowHandleCloseModal(false);
          dispatch(fetchSellRequestList({ type: "date_wise", data: dateRange }) as any);
        }
      });
    });
  };

  const isDisabled = row?.approveStatus === "Approved";

  const tableData = useMemo(() => (Array.isArray(sellRequestList) ? sellRequestList.map((item) => ({ ...item })) : []), [sellRequestList]);

  const menu = (
    <Menu>
      <Menu.Item
        key="update"
        onClick={() => {
          handleUpdate(row);
        }}
        icon={<EditOutlined className="text-base" />}
        // disabled={isDisabled}
      >
        Update
      </Menu.Item>
      <Menu.Item
        key="approve"
        onClick={() => handleshowMaterialListForApprove(row)}
        icon={<CheckCircleOutlined className="text-base" />}
        // disabled={isDisabled}
      >
        View/Approve
      </Menu.Item>
      <Menu.Item key="cancel" onClick={showCancelModal} disabled={row?.soStatus === "Closed"} icon={<CloseCircleOutlined className="text-base" />}>
        Cancel
      </Menu.Item>
      <Menu.Item
        key="materialList"
        onClick={() => handleshowMaterialList(row)}
        disabled={row?.approveStatus === "Pending" || row?.soStatus === "Closed" || row?.approveStatus === "Rejected" || row?.approveStatus === "Partially Approved"}
        icon={<CarOutlined className="text-base" />}
      >
        Create Shipment
      </Menu.Item>
      <Menu.Item key="print" onClick={() => handlePrintOrder(row?.so_id)} icon={<PrinterOutlined className="text-base" />}>
        Print
      </Menu.Item>
      <Menu.Item key="shortClose" onClick={() => handleShortClose()} disabled={row?.soStatus === "Closed"} icon={<StopOutlined className="text-base" />}>
        Short Close
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Dropdown overlay={menu} trigger={["click"]}>
        <Button icon={<MoreOutlined />} />
      </Dropdown>
      <ConfirmCancellationDialog isDialogVisible={isModalVisible} handleOk={handleOk} handleCancel={handleCancel} row={{ req_id: row?.so_id }} form={form} loading={loading} />

      <CreateShipmentListModal
        visible={isMaterialListModalVisible}
        onClose={handleMaterialListModalClose}
        sellRequestDetails={tableData}
        row={{ req_id: row?.so_id }}
        loading={loading}
        onCreateShipment={onCreateShipment}
      />
      {/* <MaterialListModal
        visible={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        sellRequestDetails={tableData}
        row={{ req_id: row?.so_id }}
        loading={loading}
        columnDefs={materialListColumnDefs}
        title={`Approve Sales Order for ${row?.so_id}`}
        submitText="Approve"
        handleSubmit={confirmApprove}
        handleReject={() => setShowRejectModal(true)}
        disableStatus={row?.approveStatus === "Approved" || row?.approveStatus === "Rejected"}
      /> */}
      <CreateInvoiceDialog
        isDialogVisible={showHandleCloseModal}
        handleOk={handleShortCloseModalOk}
        handleCancel={() => setShowHandleCloseModal(false)}
        form={shortCloseForm}
        loading={loading}
        heading="Short Close"
        description={`Are you sure you want to Short close for SO ${row.so_id}?`}
      />
      <CreateInvoiceDialog
        isDialogVisible={showRejectModal}
        handleOk={handleOkReject}
        handleCancel={() => setShowRejectModal(false)}
        form={rejectform}
        loading={loading}
        heading="Reject"
        description={`Are you sure you want to Reject this SO ${row.so_id}?`}
      />
    </>
  );
};

// Custom cell renderer for SO ID with strike-through for cancelled orders
const SoIdCellRenderer = (params: any) => {
  const isCancelled = params.data?.soStatus === "Cancelled";
  
  return (
    <div style={{ 
      textDecoration: isCancelled ? 'line-through' : 'none',
      // color: isCancelled ? '#000' : 'inherit',
      fontWeight: isCancelled ? '500' : 'normal'
    }}>
      {params.value}
    </div>
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
    headerName: "#",
    valueGetter: "node.rowIndex + 1",
    maxWidth: 50,
    filter: false,
  },

  {
    headerName: "SO ID",
    field: "so_id",
    filter: "agTextColumnFilter",
    cellRenderer: SoIdCellRenderer, 
  },
  {
    headerName: "Approve Status",
    field: "approveStatus",
    filter: "agTextColumnFilter",
  },
  {
    headerName: "Created Date",
    field: "createDate",
    filter: "agTextColumnFilter",
  },
  {
    headerName: "PO ID",
    field: "po_number",
    filter: "agTextColumnFilter",
  },
  {
    headerName: "PO Date",
    field: "po_date",
    filter: "agTextColumnFilter",
  },
  { headerName: "Status", field: "soStatus", filter: "agTextColumnFilter" },

  {
    headerName: "Customer Name",
    field: "clintname",
    filter: "agTextColumnFilter",
    width: 400,
  },
  {
    headerName: "Supplier Name",
    field: "supplierName",
    filter: "agTextColumnFilter",
    width: 300,
  },
  {
    headerName: "Created By",
    field: "createBy",
    filter: "agTextColumnFilter",
  },
  {
    headerName: "Approved By",
    field: "approveBy",
    filter: "agTextColumnFilter",
  },
  {
    headerName: "Reject Reason",
    field: "reject_reason",
    filter: "agTextColumnFilter",
    cellRenderer: TruncateCellRenderer,
  },
];

export const materialListColumnDefs: ColDef[] = [
  { headerName: "#", valueGetter: "node.rowIndex + 1", maxWidth: 50 },
  // {
  //   headerName: "SO ID",
  //   field: "so_id",
  //   width: 150,
  // },
  {
    headerName: "Part No.",
    field: "itemPartNo",
  },

  {
    headerName: "Name",
    field: "itemName",
    width: 300,
    // cellRenderer: "truncateCellRenderer",
  },
  {
    headerName: "Specification",
    field: "itemSpecification",
    width: 350,
  },

  {
    headerName: "Customer Part No.",

    field: "customer_part_no",
    width: 200,
    // cellRenderer: "truncateCellRenderer",
  },
  {
    headerName: "Due Date",
    field: "dueDate",
  },
  {
    headerName: "Qty",
    field: "qty",
  },
  {
    headerName: "Pending Qty",
    field: "pending_qty",
  },
  { headerName: "UoM", field: "uom" },
  { headerName: "GST Rate", field: "gstRate" },
  { headerName: "Price", field: "rate" },
  { headerName: "HSN/SAC", field: "hsnCode" },
  { headerName: "Remark", field: "itemRemark" },
];
