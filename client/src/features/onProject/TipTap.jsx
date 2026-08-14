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
import {
  Bold, Italic, Underline as UnderlineIcon, Highlighter,
  Heading1, List, ListChecks, Code, AlignLeft, AlignCenter,
  AlignRight, Link as LinkIcon, Image as ImageIcon
} from 'lucide-react';
import { useEffect } from "react";


function Toolbar({ editor, activeSnote,currentContent, debugging }) {
  const editorState = useEditorState({
    editor,
    selector: ctx => ({
      heading: ctx.editor.isActive('heading', { level: 1 }),
      bold: ctx.editor.isActive('bold'),
      italic: ctx.editor.isActive('italic'),
      underline: ctx.editor.isActive('underline'),
      highlight: ctx.editor.isActive('highlight'),
      alignLeft: ctx.editor.isActive({ textAlign: 'left' }),
      alignCenter: ctx.editor.isActive({ textAlign: 'center' }),
      alignRight: ctx.editor.isActive({ textAlign: 'right' }),
      bulletList: ctx.editor.isActive('bulletList'),
      taskList: ctx.editor.isActive('taskList'),
      codeBlock: ctx.editor.isActive('codeBlock'),
      link: ctx.editor.isActive('link'),
      fontSize: ctx.editor.getAttributes('textStyle').fontSize || '16px',
      color: ctx.editor.getAttributes('textStyle').color || '#ffffff',
    }),
  });

  if (!editor) return null;

  const handleSave = () => {
  if (!editor) return;
  const content = editor.getHTML();
  console.log(content)
}


  return (
    <div className="toolbar">
      <div className="sizeNcolor">
        <select
           className="fontSizeSelect"
           value={editorState.fontSize}
           onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()} >
           <option className="valueOnSelect" value="12px">12</option>
           <option className="valueOnSelect" value="14px">14</option>
           <option className="valueOnSelect" value="16px">16</option>
           <option className="valueOnSelect" value="18px">18</option>
           <option className="valueOnSelect" value="24px">24</option>
           <option className="valueOnSelect" value="32px">32</option>
           <option className="valueOnSelect" value="40px">40</option>
        </select>
        <input
          type="color"
          className="colorPicker"
          value={editorState.color}
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          title="Text Color"
          />
      </div>
      <button className={editorState.heading ? 'active' : ''} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="Heading">
            <Heading1 size={18} />
         </button>
      <div className="TextStyle">
        <button className={editorState.bold ? 'active' : ''} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">
          <Bold size={18} />
        </button>
        <button className={editorState.italic ? 'active' : ''} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic">
          <Italic size={18} />
        </button>
        <button className={editorState.underline ? 'active' : ''} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline">
          <UnderlineIcon size={18} />
        </button>
        <button className={editorState.highlight ? 'active' : ''} onClick={() => editor.chain().focus().toggleHighlight().run()} title="Highlight">
          <Highlighter size={18} />
        </button>
      </div>

      <div className="TextPositioning">
        <button className={editorState.alignLeft ? 'active' : ''} onClick={() => editor.chain().focus().setTextAlign('left').run()} title="Align Left">
          <AlignLeft size={18} />
        </button>
        <button className={editorState.alignCenter ? 'active' : ''} onClick={() => editor.chain().focus().setTextAlign('center').run()} title="Align Center">
          <AlignCenter size={18} />
        </button>
        <button className={editorState.alignRight ? 'active' : ''} onClick={() => editor.chain().focus().setTextAlign('right').run()} title="Align Right">
          <AlignRight size={18} />
        </button>
      </div>

      <div className="TextFormatting">
        <button className={editorState.bulletList ? 'active' : ''} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet List">
          <List size={18} />
        </button>
        <button className={editorState.taskList ? 'active' : ''} onClick={() => editor.chain().focus().toggleTaskList().run()} title="Checklist">
          <ListChecks size={18} />
        </button>
        <button className={editorState.codeBlock ? 'active' : ''} onClick={() => editor.chain().focus().toggleCodeBlock().run()} title="Code Block">
          <Code size={18} />
        </button>
        <button onClick={() => {
          debugging(activeSnote,currentContent);
        }}>Force save</button>
      </div>
    </div>
  );
}
const TipTap = ({currentContent, onContentChange,activeSnote, debugging}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      FontSize,
],
    content: currentContent,
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    }
  });
  useEffect(() => {
    if (
      editor &&
      currentContent !== undefined &&
      currentContent !== editor.getHTML()
    ){
      editor.commands.setContent(currentContent)
    }
  }, [editor, currentContent]);

  return (
    <div>
      <Toolbar editor={editor} activeSnote={activeSnote} debugging={debugging} currentContent={currentContent}/>
      <EditorContent editor={editor} />
    </div>
  );
};

export default TipTap