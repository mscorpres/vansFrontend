import type { FC } from "react";
import { Drawer, Divider, Typography } from "antd";
import SelectEndPoint from "@/components/ims-settings/SelectEndPoint";
import SelectSocketEndPoint from "@/components/ims-settings/SelectSocketEndPoint";

type Props = {
  open: boolean;
  onClose: () => void;
};

const SettingDrawer: FC<Props> = ({ open, onClose }) => {
  return (
    <Drawer
      title="IMS Settings"
      placement="right"
      width={420}
      onClose={onClose}
      open={open}
      destroyOnClose
    >
      <Typography.Title level={5} className="!mb-3 !mt-0">
        Add Custom URL
      </Typography.Title>
      <SelectEndPoint />
      <Divider className="!my-6" />
      <Typography.Title level={5} className="!mb-3 !mt-0">
        Add Custom Socket URL
      </Typography.Title>
      <SelectSocketEndPoint />
    </Drawer>
  );
};

export default SettingDrawer;
