import { useState,useEffect,useRef } from "react";
import { useEditor, EditorContent, useEditorState} from "@tiptap/react";
import {
  Bold, Italic, Underline as UnderlineIcon, Highlighter,
  Heading1, List, ListChecks, Code, AlignLeft, AlignCenter,
  AlignRight, Link as LinkIcon, Image as ImageIcon,
  Heading2,
  Heading3
} from 'lucide-react';

function LinkPopover({ editor, onClose }) {
  const [url, setUrl] = useState(editor.getAttributes('link').href || '');
  const popoverRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        onClose();
      }
    }
    function handleEscape(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const applyLink = () => {
  if (url.trim() === '') return;
  editor.chain().focus().setLink({ href: url.trim() }).run();
  onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      applyLink();
    }
  };

  return (
    <div className="linkPopover" ref={popoverRef}>
      <div className="linkNapplyDiv">
        <input
        ref={inputRef}
        type="text"
        placeholder="Paste a link..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={handleKeyDown}
        className="linkPopoverInput"
       />
       <button className="linkPopoverConfirm" onClick={applyLink}>
         Apply
       </button>

      </div>
      <div>
        <p className="linksNoContolledText">Be careful when clicking links that aren't yours!</p>
      </div>
    </div>
  );
}

export default function Toolbar({ editor, activeSnote, currentContent }) {
  if (!editor) return null;

  return (
    <ToolbarContent
      editor={editor}
      activeSnote={activeSnote}
      currentContent={currentContent}
    />
  );
}
function ToolbarContent({ editor, activeSnote,currentContent }) {
  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const editorState = useEditorState({
    editor,
    selector: ctx => ({
      heading: ctx.editor.isActive('heading', { level: 2 }),
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
           <option className="valueOnSelect" value="36px">36</option>
           <option className="valueOnSelect" value="48px">48</option>
           <option className="valueOnSelect" value="60px">60</option>
           <option className="valueOnSelect" value="72px">72</option>
        </select>
        <input
          type="color"
          className="colorPicker"
          value={editorState.color}
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          title="Text Color"
          />
      </div>
      <button className={editorState.heading ? 'active' : ''} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading">
            <Heading2 size={18} />
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
      </div>
      <div className="linkButtonWrapper">
        <button
            className={editorState.link ? 'active' : ''}
            onClick={() => {
              if (editorState.link) {
                editor.commands.unsetMark('link', { extendEmptyMarkRange: false });
                editor.commands.focus();
              } else {
                setIsLinkOpen(prev => !prev);
              }
            }}
            title="Link"
            >
            <LinkIcon size={18} />
        </button>
        {isLinkOpen && (<LinkPopover editor={editor} onClose={() => setIsLinkOpen(false)} />
        )}
      </div>
    </div>
  );
}