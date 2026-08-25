import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-color";
import Underline from "@tiptap/extension-underline";
import { TextStyle, FontSize } from "@tiptap/extension-text-style";
import "./css/tipTap.css";
import { useEffect } from "react";
import { NoteReference } from "./TipTapNodes/refNoteNode";
import { IconNode } from "./TipTapNodes/iconNode";


const TipTap = ({
  currentContent,
  onContentChange,
  activeSnote,
  setEditor,
  currentSnoteWantsSave,
  projectWantsAutoSave,
  setActiveWindowId,
  windows,
  setWindows
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
      FontSize,
      Underline,
      NoteReference,
      IconNode,
    ],

    content: currentContent,

    editorProps: {
      attributes: {
        spellcheck: "false",
      },
    },

    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor) {
      setEditor(editor);
    }
  }, [editor, setEditor]);

  useEffect(() => {
    if (editor && currentContent !== undefined) {
      editor.commands.setContent(currentContent);
    }
  }, [activeSnote]);
  useEffect(() => {
  if (!editor) return;
  const dom = editor.view.dom;
  function handleClick(e) {
    const btn = e.target.closest("[data-note-reference]");
    if (!btn) return;
   const noteId = btn.getAttribute("data-note-id");
   const noteName = btn.getAttribute("data-note-name");
   if (noteId) {
      const id = Number(noteId);
      setActiveWindowId(id);
      if (!windows.find(w => w.id === id))
      {setWindows(prev => [...prev, { id, name: noteName }]);}
}
  }
  dom.addEventListener("click", handleClick);
  return () => dom.removeEventListener("click", handleClick);
}, [editor, setActiveWindowId, windows, setWindows]);

  return (
    <div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default TipTap;