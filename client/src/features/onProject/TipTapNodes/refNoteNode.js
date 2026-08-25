import { Node } from "@tiptap/core";

export const NoteReference = Node.create({
  name: "noteReference",

  inline: true,
  group: "inline",
  atom: true,

  addAttributes() {
    return {
      noteId: {
        default: null,
      },

      noteName: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "button[data-note-reference]",
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
  return [
    "button",
    {
      ...HTMLAttributes,
      "data-note-reference": "",
      "data-note-id": node.attrs.noteId,
      "data-note-name":node.attrs.noteName,
      type: "button",
      class: "noteReference",
    },
    node.attrs.noteName,
  ];
}
});