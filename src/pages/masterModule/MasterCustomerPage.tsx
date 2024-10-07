import React, { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { clientFormSchema } from "@/schema/masterModule/customerSchema";
import ReusableTable from "@/components/shared/ReusableTable";
import columnDefs from "@/config/agGrid/mastermodule/CustomerTable";
import { transformCustomerTableData } from "@/helper/TableTransformation";
import ClientActionCellRender from "@/config/agGrid/mastermodule/ClientActionCellRender";
import { Badge } from "@/components/ui/badge";
import { useDispatch } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { AppDispatch } from "@/store";
import { createClient } from "@/features/client/clientSlice";
import styled from "styled-components";
import { AgGridReact } from "ag-grid-react";
import { getListOFViewCustomers } from "@/components/shared/Api/masterApi";
import useApi from "@/hooks/useApi";

const MasterCustomerPage: React.FC = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const { execFun, loading: loading1 } = useApi();
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const form = useForm<z.infer<typeof clientFormSchema>>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      clientName: "",
      panNo: "",
      mobileNo: "",
      email: "",
      website: "",
      salesPersonName: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof clientFormSchema>) => {
    try {
      const resultAction = await dispatch(
        createClient({
          endpoint: "/client/add",
          payload: {
            clientName: values.clientName,
            panNo: values.panNo,
            mobileNo: values.mobileNo,
            email: values.email || "",
            website: values.website || "",
            salesPersonName: values.salesPersonName || "",
          },
        })
      ).unwrap();

      if (resultAction.message) {
        toast({
          title: "Client created successfully",
          className: "bg-green-600 text-white items-center",
        });
      } else {
        toast({
          title: resultAction.message || "Failed to Create Product",
          className: "bg-red-600 text-white items-center",
        });
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const components = useMemo(
    () => ({
      actionsCellRenderer: ClientActionCellRender,
      statusCellRenderer: (params: any) => {
        return <Badge className="bg-green-600">{params.data.status}</Badge>;
      },
    }),
    []
  );
  const columnDefs: ColDef<rowData>[] = [
    {
      headerName: "ID",
      field: "id",
      filter: "agNumberColumnFilter",
      width: 90,
    },
    {
      headerName: "Client Code",
      field: "code",
      filter: "agTextColumnFilter",
      flex: 1,
    },
    {
      headerName: "Client Name",
      field: "name",
      filter: "agTextColumnFilter",
      flex: 1,
    },
    {
      headerName: "City",
      field: "city",
      filter: "agTextColumnFilter",
      flex: 1,
    },
    {
      headerName: "Mobile",
      field: "mobile",
      filter: "agTextColumnFilter",
      flex: 1,
    },
    {
      headerName: "Email",
      field: "email",
      filter: "agTextColumnFilter",
      flex: 1,
    },
    {
      headerName: "GSTIN",
      field: "gst",
      filter: "agTextColumnFilter",
      flex: 1,
    },
  ];
  const fetchList = async (formData: z.infer<typeof FormSchema>) => {
    // return;
    const response = await execFun(() => getListOFViewCustomers(), "fetch");
    console.log("response", response);
    // return;
    let { data } = response;
    if (response.status === 200) {
      let arr = data.data.map((r, index) => {
        return {
          id: index + 1,
          ...r,
        };
      });
      setRowData(arr);
      //   addToast(response.message, {
      //     appearance: "success",
      //     autoDismiss: true,
      //   });
    } else {
      //   addToast(response.message, {
      //     appearance: "error",
      //     autoDismiss: true,
      //   });
    }
  };
  useEffect(() => {
    fetchList();
  }, []);

  return (
    <Wrapper>
      <div className="ag-theme-quartz h-[calc(100vh-100px)]">
        <AgGridReact
          //   loadingCellRenderer={loadingCellRenderer}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ filter: true, sortable: true }}
          pagination={true}
          paginationPageSize={10}
          paginationAutoPageSize={true}
        />
      </div>
    </Wrapper>
  );
};

export default MasterCustomerPage;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
