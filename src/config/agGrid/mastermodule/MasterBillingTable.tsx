import { Button } from '@/components/ui/button';

// import ActionCellRender from './ActionCellRender';
import ClientActionCellRender from './ClientActionCellRender';
import { Copy } from 'lucide-react';
import { ColDef } from '@ag-grid-community/core';


export const columnDefs: ColDef[] = [
  { 
    headerName: 'ID', 
    field: 'id', 
    valueGetter: 'node.rowIndex + 1', 
    sortable: true, 
    filter: true,
   maxWidth:80
  },
  { headerName: 'Label', field: 'label', sortable: true, filter: true },
  { headerName: 'Company', field: 'company', sortable: true, filter: true, cellRenderer: (params:any) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {params.value}
      <Button   className='p-[2px] bg-transparent border-none shadow-none text-cyan-700 hover:bg-transparent' style={{ marginLeft: '10px' }} onClick={() => handleCopy(params.value)}>
        <Copy className='h-[20px] w-[20px] '/>
      </Button>
    </div>
  )},
  { headerName: 'Pan No', field: 'pan', sortable: true, filter: true },
  { headerName: 'State', field: 'state', sortable: true, filter: true , cellRenderer:()=>"Good"},
  { headerName: 'Address', field: 'address', sortable: true, filter: true },
  { headerName: 'AddressLine1', field: 'addressLine1', sortable: true, filter: true },
  { headerName: 'AddressLine2', field: 'addressLine2', sortable: true, filter: true },
  { headerName: 'Cin No', field: 'cin', sortable: true, filter: true },
  { headerName: 'GST No', field: 'gstin', sortable: true, filter: true },

  { 
    headerName: 'Actions', 
    field: 'actions', 
    cellRenderer: () => (
      <div>
       <ClientActionCellRender/>
      </div>
    ) 
  }
];

// Handle Copy Button
const handleCopy = (value: any) => {
  navigator.clipboard.writeText(value);
};

// Open Modal Function

export interface RowData {
    id: number;
    label: string;
    company: string;
    pan: string;
    state:string,
    gstin:string,
    address:string,
    addressLine1:string,
    addressLine2:string
  }