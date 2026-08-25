import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import IconNodeView from "./IconNodeView";

export const IconNode = Node.create({
  name: "iconNode",
  inline: true,
  group: "inline",
  atom: true,

  addAttributes() {
    return {
      iconName: { default: null },
      color: { default: "#ffffff" },
      size: { default: 24 },
    };
  },

  parseHTML() {
    return [{ tag: "span[data-icon-node]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes, { "data-icon-node": "" })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(IconNodeView);
  },
});