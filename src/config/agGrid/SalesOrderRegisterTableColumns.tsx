import { RowData } from "@/types/SalesOrderRegisterType";
import { ColDef } from "ag-grid-community";
import { MoreOutlined } from "@ant-design/icons";
import { Button, Menu, Dropdown, Form } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useMemo, useState } from "react";
import CreateShipmentListModal from "@/config/agGrid/registerModule/CreateShipmentListModal";
import { ConfirmCancellationDialog } from "@/config/agGrid/registerModule/ConfirmCancellationDialog";
import { CreateInvoiceDialog } from "@/config/agGrid/registerModule/CreateInvoiceDialog";
import CopyCellRenderer from "@/components/shared/CopyCellRenderer";
import {
  approveSo,
  cancelSalesOrder,
  createShipment,
  fetchMaterialList,
  fetchSellRequestList,
  printSellOrder,
  rejectSo,
  shortClose,
} from "@/features/salesmodule/SalesSlice";
import { printFunction } from "@/components/shared/PrintFunctions";
import { toast } from "@/components/ui/use-toast";
import MaterialListModal from "@/config/agGrid/registerModule/MaterialListModal";
import { TruncateCellRenderer } from "@/General";

interface ActionMenuProps {
  row: RowData; // Use the RowData type here
}

const ActionMenu: React.FC<ActionMenuProps> = ({ row }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isMaterialListModalVisible, setIsMaterialListModalVisible] =
    useState(false);
  const [showHandleCloseModal, setShowHandleCloseModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [form] = Form.useForm();
  const [shortCloseForm] = Form.useForm(); // Form instance for the invoice modal
  const [rejectform] = Form.useForm(); // Form instance for the invoice modal
  const { sellRequestList, loading } = useSelector(
    (state: RootState) => state.sellRequest
  );
  const dateRange = useSelector(
    (state: RootState) => state.sellRequest.dateRange
  );

  const handleUpdate = (row: any) => {
    const soId = row?.so_id; // Replace with actual key for employee ID
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
    dispatch(fetchMaterialList({ so_id: row?.so_id }));
    setIsMaterialListModalVisible(true);
  };

  const handleshowMaterialListForApprove = (row: RowData) => {
    dispatch(fetchMaterialList({ so_id: row?.so_id }));
    setShowConfirmationModal(true);
  };

  const confirmApprove = () => {
    dispatch(approveSo({ so_id: row?.so_id })).then((response: any) => {
      if (response?.payload?.success) {
        toast({
          className: "bg-green-600 text-white items-center",
          title:
            response.payload.message || "Sales Order Approved successfully",
        });
        dispatch(
          fetchSellRequestList({ type: "date_wise", data: dateRange }) as any
        );
      }
    });
    setShowConfirmationModal(false);
  };

  const handleOkReject = () => {
    rejectform
      .validateFields()
      .then((values) => {
        const payload = {
          remark: values.remark || "",
          so_id: row?.so_id,
        };
        dispatch(rejectSo(payload) as any).then((response: any) => {
          console.log(response);
          if (response?.payload?.code == 200) {
            form.resetFields();
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
          console.log(response);
          if (response?.payload?.success) {
            form.resetFields(); // Clear the form fields after submission
            toast({
              className: "bg-green-600 text-white items-center",
              title: response.payload.message,
            });
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
      console.log(response);
      if (response?.payload?.success) {
        toast({
          className: "bg-green-600 text-white items-center",
          title: response.payload.message,
        });
        setIsMaterialListModalVisible(false);
        handleMaterialListModalClose();
        dispatch(
          fetchSellRequestList({ type: "date_wise", data: dateRange }) as any
        );
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
        if (response?.payload?.success) {
          toast({
            className: "bg-green-600 text-white items-center",
            title: response.payload.message,
          });
          setShowHandleCloseModal(false);
          dispatch(
            fetchSellRequestList({ type: "date_wise", data: dateRange }) as any
          );
        }
      });
    });
  };

  const isDisabled = row?.approveStatus === "Approved";

  const tableData = useMemo(
    () =>
      Array.isArray(sellRequestList)
        ? sellRequestList.map((item) => ({ ...item }))
        : [],
    [sellRequestList]
  );

  const menu = (
    <Menu>
      <Menu.Item
        key="update"
        onClick={() => {
          handleUpdate(row);
        }}
        disabled={isDisabled}
      >
        Update
      </Menu.Item>
      <Menu.Item
        key="approve"
        onClick={() => handleshowMaterialListForApprove(row)}
        // disabled={isDisabled}
      >
        View/Approve
      </Menu.Item>
      <Menu.Item
        key="cancel"
        onClick={showCancelModal}
        disabled={row?.soStatus === "Closed"}
      >
        Cancel
      </Menu.Item>
      <Menu.Item
        key="materialList"
        onClick={() => handleshowMaterialList(row)}
        disabled={
          row?.approveStatus === "Pending" ||
          row?.soStatus === "Closed" ||
          row?.approveStatus === "Rejected"
        }
      >
        Create Shipment
      </Menu.Item>
      <Menu.Item key="print" onClick={() => handlePrintOrder(row?.so_id)}>
        Print
      </Menu.Item>
      <Menu.Item
        key="shortClose"
        onClick={() => handleShortClose()}
        disabled={row?.soStatus === "Closed"}
      >
        Short Close
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

      <CreateShipmentListModal
        visible={isMaterialListModalVisible}
        onClose={handleMaterialListModalClose}
        sellRequestDetails={tableData}
        row={{ req_id: row?.so_id }}
        loading={loading}
        onCreateShipment={onCreateShipment}
      />
      <MaterialListModal
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
      />
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
    cellRenderer: CopyCellRenderer,
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
    cellRenderer: CopyCellRenderer,
  },
  {
    headerName: "PO Date",
    field: "po_date",
    filter: "agTextColumnFilter",
  },
  { headerName: "Status", field: "soStatus", filter: "agTextColumnFilter" },
  {
    headerName: "Approve Status",
    field: "approveStatus",
    filter: "agTextColumnFilter",
  },
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
    headerName: "Created By",
    field: "createBy",
    filter: "agTextColumnFilter",
  },
  {
    headerName: "Approved By",
    field: "approve_by",
    filter: "agTextColumnFilter",
  },
  {
    headerName: "Reject Reason",
    field: "reject_reason",
    filter: "agTextColumnFilter",
    cellRenderer: TruncateCellRenderer,
  },
];

const materialListColumnDefs: ColDef[] = [
  { headerName: "#", valueGetter: "node.rowIndex + 1", maxWidth: 50 },
  {
    headerName: "SO ID",
    field: "so_id",
    width: 150,
  },
  {
    headerName: "Item",
    field: "item",
    width: 200,
    cellRenderer: "truncateCellRenderer",
  },
  {
    headerName: "Item Name",
    field: "itemName",
    width: 300,
    cellRenderer: "truncateCellRenderer",
  },
  {
    headerName: "Item Specification",
    field: "itemSpecification",
    cellRenderer: "truncateCellRenderer",
  },
  { headerName: "SKU Code", field: "itemPartNo" },
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
