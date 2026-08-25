import { NodeViewWrapper } from "@tiptap/react";
import { DynamicIcon } from "lucide-react/dynamic";

export default function IconNodeView({ node }) {
  const { iconName, color, size } = node.attrs;
  return (
    <NodeViewWrapper as="span" className="iconNodeWrapper">
      <DynamicIcon name={iconName} color={color} size={size} />
    </NodeViewWrapper>
  );
}