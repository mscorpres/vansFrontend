import { FaCaretDown } from "react-icons/fa";
import{ components } from "react-select";
 const DropdownIndicator = (props: any) => {
    return (
      <components.DropdownIndicator {...props}>
        <FaCaretDown className="text-slate-700 text-[23px]" /> {/* Change this to your desired color */}
      </components.DropdownIndicator>
    );
  };

  export default DropdownIndicator