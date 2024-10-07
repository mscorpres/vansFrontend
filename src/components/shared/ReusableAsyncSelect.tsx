// src/components/ReusableAsyncSelect.tsx

import { useState } from "react";
import AsyncSelect from "react-select/async";
import { useDispatch, useSelector } from "react-redux";
import { fetchData, ApiResponse } from "@/features/reactSelect/FetchThunk";
import { RootState, AppDispatch } from "@/store";
import { Skeleton } from "antd";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
interface ReusableAsyncSelectProps<T> {
  endpoint: string;
  transform: (data: T[]) => { label: string; value: string }[];
  onChange: (selectedOption: { label: string; value: string } | null) => void;
  value?: { label: string; value: string } | null; // Add value prop
  fetchOptionWith: "query" | "payload";
  placeholder: string;
}

const ReusableAsyncSelect = <T,>({ endpoint, transform, onChange, value, fetchOptionWith, placeholder }: ReusableAsyncSelectProps<T>) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isOpen, setIsOpen] = useState(false); // State to track if select is open
  const options = useSelector((state: RootState) => state.select[endpoint]?.options || []);
  const loading = useSelector((state: RootState) => state.select[endpoint]?.loading || false);

  const loadOptions = (inputValue: string, callback: (options: { label: string; value: string }[]) => void) => {
    if (fetchOptionWith === "query") {
      dispatch(fetchData({ endpoint, query: inputValue })).then((action) => {
        if (fetchData.fulfilled.match(action)) {
          const response = action.payload as ApiResponse<T[]>;
          callback(transform(response.data));
        } else {
          callback([]);
        }
      });
    } else if (fetchOptionWith === "payload") {
      dispatch(fetchData({ endpoint, payload: { search: inputValue } })).then((action) => {
        if (fetchData.fulfilled.match(action)) {
          const response = action.payload as ApiResponse<T[]>;
          if (Array.isArray(response)) {
            callback(transform(response));
          } else {
            callback(transform(response.data));
          }
        } else {
          callback([]);
        }
      });
    }
  };

  const handleMenuOpen = () => {
    if (!isOpen) {
      setIsOpen(true);
      // Optionally trigger API call when select is opened
      loadOptions("", () => {});
    }
  };

  const handleMenuClose = () => {
    setIsOpen(false);
  };
  const handleChange = (selectedOption: { label: string; value: string } | null) => {
    onChange(selectedOption); // Call the onChange prop with selected option
    // Optionally handle any other actions on select change
  };
  return (
    <AsyncSelect
      styles={customStyles}
      components={{ DropdownIndicator }}
      cacheOptions
      loadOptions={loadOptions}
      defaultOptions={transform(options)}
      isLoading={loading}
      onMenuOpen={handleMenuOpen}
      onMenuClose={handleMenuClose}
      onChange={handleChange}
      value={value}
      placeholder={placeholder}
      loadingMessage={() => (
        <div className="flex flex-col gap-[10px]">
          <Skeleton className="h-[20px] w-full" />
          <Skeleton className="h-[20px] w-full" />
          <Skeleton className="h-[20px] w-full" />
          <Skeleton className="h-[20px] w-full" />
          <Skeleton className="h-[20px] w-full" />
        </div>
      )}
    />
  );
};

export default ReusableAsyncSelect;
