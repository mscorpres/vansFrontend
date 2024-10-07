import { Input } from "@/components/ui/input";

const DatePickerCellRenderer = (props: any) => {
    const { value, colDef, data, api, column } = props;
  
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      data[colDef.field] = newValue; // update the data
      api.refreshCells({ rowNodes: [props.node], columns: [column] }); // refresh the cell to show the new value
    };
  
    if (data.isNew) {
      return (
        <Input
          type="date"
          value={value ? value : ''}
          onChange={handleChange}
          className="input-date"
        />
      );
    }
  
    return <span>{value}</span>;
  };

  export default DatePickerCellRenderer