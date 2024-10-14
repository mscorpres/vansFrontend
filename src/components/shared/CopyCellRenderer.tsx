import { toast } from "@/components/ui/use-toast";
import { CopyIcon } from "lucide-react";
import { Tooltip } from "antd";
import styled from "styled-components";

const CopyCellWrapper = styled.div`
  display: flex;
  align-items: center;
  max-width: 100%;
`;

const TextWithEllipsis = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: calc(100% - 30px); /* Adjust to account for icon space */
  display: inline-block;
  padding-right: 10px; /* Add padding for better spacing */
`;

const CopyCellRenderer = (params: any) => {
  const copyToClipboard = (value: any) => {
    navigator.clipboard.writeText(value).then(() => {
      toast({
        title: "Copied to clipboard: " + value,
        className: "bg-blue-600 text-white items-center",
      });
    });
  };

  return (
    <CopyCellWrapper>
      <TextWithEllipsis title={params.value}>{params.value}</TextWithEllipsis>
      <Tooltip title={params.value} placement="top" mouseEnterDelay={0.5} mouseLeaveDelay={0.5}>
        <CopyIcon
          onClick={() => copyToClipboard(params.value)}
          style={{
            cursor: "pointer",
            marginLeft: "10px",
            width: "20px",
            height: "20px",
          }}
          aria-label={`Copy ${params.value}`}
        />
      </Tooltip>
    </CopyCellWrapper>
  );
};

export default CopyCellRenderer;
