import { Badge } from "@/components/ui/badge";


const StatusCellRenderer = (props: any) => {
    const { value, data, api, column } = props;
  
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = event.target.value;
      data.approvedStatus = newValue; // update the data
      api.refreshCells({ rowNodes: [props.node], columns: [column] }); // refresh the cell to show the new value
    };
  
    if (data.isNew) {
      return (
        <select value={value} onChange={handleChange} className="px-[10px] rounded-md border border-slate-600 py-[5px] text-slate-600 ">
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
          <option value="Approved">Approved</option>
        </select>
      );
    }
  
    return <Badge className={`${value === "Approved" ? "bg-green-600" : value === "Rejected" ? "bg-red-600" : "bg-yellow-600"}`}>{value}</Badge>;
  };

  export default StatusCellRenderer