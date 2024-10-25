import React, { useState } from "react";
import { Modal, Button, Input, Typography } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface CurrencyRateDialogProps {
  open: boolean;
  onClose: () => void;
  currency: string;
  price: number;
  inputHandler: (field: string, value: any, rowId?: any) => void;
  rowId?: any;
}

const CurrencyRateDialog: React.FC<CurrencyRateDialogProps> = ({
  open,
  onClose,
  currency,
  price,
  inputHandler,
  rowId,
}) => {
  const [rate, setRate] = useState<number>(0);
//   const { currency: currencyList } = useSelector(
//     (state: RootState) => state.createSalesOrder
//   );
  const { currencyList } = useSelector((state: RootState) => state.client);

  const submitHandler = () => {
    inputHandler("exchange_rate", { rate, currency }, rowId);
    handleClose();
  };

  const handleClose = () => {
    setRate(0);
    onClose();
  };
  const currencySymbol = currencyList?.find(
    (item) => item.currency_id === currency
  )?.currency_symbol;

  return (
    <Modal
      title="Enter Currency Rate"
      open={open}
      width={300}
      onCancel={handleClose}
      footer={[
        <Button key="back" onClick={handleClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={submitHandler}
          className="bg-green-700 hover:bg-green-600"
        >
          Submit
        </Button>,
      ]}
    >
      <Input
        value={rate}
        onChange={(e) => setRate(parseFloat(e.target.value))}
        type="number"
        placeholder="Enter Rate of exchange"
      />
      <Typography.Title
        level={5}
        style={{ display: "flex", justifyContent: "center", marginTop: "15px" }}
      >
        {currencySymbol} {(rate * price).toFixed(2)}
      </Typography.Title>
      <Typography.Title
        level={5}
        style={{ display: "flex", justifyContent: "center" }}
      >
        ₹ {price.toFixed(2)}
      </Typography.Title>
    </Modal>
  );
};

export default CurrencyRateDialog;
