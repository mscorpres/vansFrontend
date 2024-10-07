import React, { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MasterCustomer } from '../../../types/masterModule/masterCustomerTypes';
import MasterClientEdit from "@/components/shared/MasterClientEdit";
import MasterClientBranch from "@/components/shared/MasterClientBranch";
import MasterEditViewBranch from "@/components/shared/MasterEditViewBranch";

const ClientActionCellRender: React.FC = (params: any) => {
  const [clientEdit, setClientEdit] = useState<boolean>(false);
  const [clientBranch, setClientBranch] = useState<boolean>(false);
  const [editView, setEditView] = useState<boolean>(false);
  
 

  const clientId = params.data.clientID; 
  console.log(clientId)

  const uiState: MasterCustomer = {
    clientEdit,
    setClientEdit,
    params,
    clientBranch,
    setClientBranch,
    editView,
    setEditView,
    clientId,
  };

  return (
    <div>
      <MasterClientEdit uiState={uiState} />
      <MasterClientBranch uiState={uiState} />
      <MasterEditViewBranch uiState={uiState} />
      <DropdownMenu>
        <DropdownMenuTrigger className="hover:bg-neutral-50 p-[5px] rounded-md">
          <BsThreeDotsVertical className="text-slate-600 h-[20px] w-[20px]" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Action</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="hover:bg-cyan-600 hover:text-white" onClick={() => setClientEdit(true)}>
            Edit Client
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setClientBranch(true)}>Add Branch</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setEditView(true)}>Edit / View Branch Details</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ClientActionCellRender;
