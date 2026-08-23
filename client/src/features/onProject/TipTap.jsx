import { useEditor, EditorContent, useEditorState} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-color";
import Image from "@tiptap/extension-image";
import { TextStyle, FontSize } from "@tiptap/extension-text-style";
import './css/tipTap.css'
import { useEffect,useState,useRef } from "react";

const TipTap = ({currentContent, onContentChange,activeSnote,setEditor,currentSnoteWantsSave, projectWantsAutoSave}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      FontSize, ],
    content: currentContent,
    editorProps: {
    attributes: { spellcheck: 'false', }, },


    onUpdate: ({ editor }) => {onContentChange(editor.getHTML());}
  });
  useEffect(() => {
    if (editor){setEditor(editor)}
  },[editor,setEditor])

useEffect(() => {
  if (editor && currentContent !== undefined) {
    editor.commands.setContent(currentContent);
  }
}, [activeSnote]);

  return (
    <div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default TipTap