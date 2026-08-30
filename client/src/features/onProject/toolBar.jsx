import { useState, useEffect, useRef } from "react";
import { useEditorState } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Highlighter,
  Heading2,
  List,
  ListChecks,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Parentheses,
  Info,
  Loader,
} from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
const devIconNames = [
  "git-branch", "git-commit", "git-merge", "git-pull-request",
  "git-compare", "git-fork", "git-pull-request-closed", "git-pull-request-draft",
  "folder-git", "folder-git-2", "merge", "split", "diff", "history",
  "code", "code-2", "braces", "brackets", "terminal", "square-terminal", "variable", "function-square","binary", "blocks", "component", "layers", "workflow",
  "file-code", "file-json", "file-text", "file-digit", "folder-code", 
  "folder-open", "folder-kanban", "copy", "scissors",
  "database", "database-backup", "database-zap", "table-properties",
  "server", "server-cog", "server-crash", "server-off", 
  "cloud", "cloud-cog", "cloud-lightning", "cloud-rain", "cloud-upload", "cloud-download",
  "container", "cylinder", "network", "wifi", "cable", "radio-tower", "webhook",
  "cpu", "hard-drive",
  "bug", "bug-off", "activity", "gauge", "gauge-circle", "heart-pulse", 
  "inspection-panel", "scan", "microscope", "target", "list-tree", "tree-deciduous",
  "lock", "key", "shield", "shield-check", "shield-alert",
  "package", "package-check", "box", "boxes", "rocket", "zap",
  "settings", "sliders-horizontal", "wrench", "hammer",
  "split-square-vertical", "columns-3", "panel-left",
  "flag", "flag-triangle-right", "bookmark", "star", "pin",
  "check", "check-check", "x", "circle-alert", "triangle-alert",
  "info", "clock", "timer", "hourglass",
  "link", "link-2", "external-link", "eye", "eye-off",
  "rss", "share-2"
];

function LinkPopover({ editor, onClose }) {
  const [url, setUrl] = useState(
    editor.getAttributes("link").href || ""
  );

  const popoverRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target)
      ) {
        onClose();
      }
    }

    function handleEscape(e) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const applyLink = () => {
    if (url.trim() === "") return;

    editor
      .chain()
      .focus()
      .setLink({ href: url.trim() })
      .run();

    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
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

        <button
          className="linkPopoverConfirm"
          onClick={applyLink}
        >
          Apply
        </button>
      </div>

      <div>
        <p className="linksNoContolledText">
          Be careful when clicking links that aren't yours.
        </p>
      </div>
    </div>
  );
}
function IconPopover({ editor, onClose, whenUndefined }) {
  const fontSizeRef = editor.getAttributes("textStyle").fontSize ? Number(String(editor.getAttributes("textStyle").fontSize).slice(0,2)) / 2 : 16
  const currentColor = editor.getAttributes('textStyle').color || whenUndefined
  const [search, setSearch] = useState("");
  const [color, setColor] = useState(currentColor);
  const [size, setSize] = useState(fontSizeRef);

  const popoverRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) onClose();
    }
    function handleEscape(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const filteredIcons = devIconNames.filter(n => n.includes(search.toLowerCase()));

  const insertIcon = (iconName) => {
    editor.chain().focus().insertContent({
      type: "iconNode",
      attrs: { iconName, color, size },
    }).run();
    onClose();
  };

  return (
    <div className="linkPopover iconPopover" ref={popoverRef}>
      <input
        type="text"
        placeholder="//"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="iconPopoverInput"
      />

       <div className="iconPickerControls">
       <label className="colorPicker" title="Icon Color">
       <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
       />
       <span
        className="colorPickerIndicator"
        style={{ backgroundColor: color }}
       />
       <span className="colorPickerValue">{color}</span>
       </label>
        <input
          type="number"
          value={size}
          min={12}
          max={64}
          onChange={(e) => setSize(Number(e.target.value))}
        />
      </div>

      <div className="iconGrid">
        {filteredIcons.slice(0, 60).map((n) => (
          <button key={n} className="iconGridItem" onClick={() => insertIcon(n)}>
            <DynamicIcon name={n} size={18} className="iconOnPopover" />
          </button>
        ))}
      </div>
    </div>
  );
}

function ReferencePopover({ editor, onClose,avChainMethods, avChainUses,mySecNotes }) {
  const [reference, setReference] = useState("");
  const chainMethod = reference.length >= 2 ? reference.slice(0,2) : null
  const valideChainMethod = avChainMethods.find(m => m === chainMethod);
  const endChainUse = reference.includes("(") ? reference.indexOf("(") : null;
  const chainUse = endChainUse ? reference.slice(2, endChainUse) : null
  const valideChainUse = avChainUses.find(u => u === chainUse);
  const endChainDirection = reference.includes(")") ? reference.indexOf(")") : null
  const chainDirection = endChainDirection ? reference.slice(endChainUse + 1,endChainDirection) : null
  const [chainError,setChainError] = useState(null)
  const targetNote = mySecNotes.find(n => n.name.toLowerCase() === chainDirection?.toLowerCase())

  const suggestions = chainMethod === "->" ? avChainUses.filter(avUse => avUse.toLowerCase().includes(reference.slice(2).toLocaleLowerCase())) : []
  
  function validateChainFunction(chainMethod,chainUse,chainDirection){
    if (!chainMethod || !chainUse || !chainDirection){return "Missing chain parameters"}
    if (!avChainMethods.includes(chainMethod)){return `Invalid chainMethod (${chainMethod})`}
    //method ->ref
    if (chainMethod === avChainMethods[0]){
      if (chainMethod === avChainMethods[0] && chainUse === avChainUses[0]) {
      if (!targetNote) return `Invalid chainDir, using ->ref (${chainDirection}) not found`;
      }
      else{ return `Invalid chainUse (${chainUse})`}
    }
    return null
  }

  const popoverRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target)
      ) {
        onClose();
      }
    }

    function handleEscape(e) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const applyReference = () => {
  if (reference.trim() === "") return;
  const error = validateChainFunction(chainMethod, chainUse, chainDirection);
  if (error === null) {
    editor.chain().focus().insertContent({
      type: "noteReference",
      attrs: { noteId: targetNote.id, noteName: targetNote.name },
    }).run();
    onClose();
  }
  setChainError(error);
};

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      applyReference();
    }
  };

  return (
    <div className="linkPopover" ref={popoverRef}>
      <div className="linkNapplyDiv">
        <p>{">>"}</p>
        <input
          ref={inputRef}
          type="text"
          placeholder="method"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          onKeyDown={handleKeyDown}
          className="linkPopoverInput"
          autoCorrect="none"
        />

        <button
          className="linkPopoverConfirm"
          onClick={() => {
            applyReference();}}
        >
          <Parentheses size={18}/>
        </button>
      </div>
      <div className="methodsSugestDiv">
        {suggestions.map(s => <p>
          {s}
        </p>)}
      </div>
      {chainError ? <p style=
      {{
        color:"red",
        fontSize:"13px",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        gap:"5px",
        margin:"0px"
      }}><Info size={10}/>{chainError}</p> :
       null}
      <div className="refDivFooter">
        <a href="#">Handled chain functions</a>
        <Info size={16}/>
        <p>(in progress)</p>
      </div>
    </div>
  );
}

export default function Toolbar({
  editor,
  activeSnote,
  currentContent,
  avChainMethods,
  avChainUses,
  mySecNotes,
  setActiveWindowId,
  theme
}) {
  if (!editor) return null;

  return (
    <ToolbarContent
      editor={editor}
      activeSnote={activeSnote}
      currentContent={currentContent}
      avChainMethods={avChainMethods}
      avChainUses={avChainUses}
      mySecNotes={mySecNotes}
      setActiveWindowId={setActiveWindowId}
      theme={theme}
    />
  );
}

function ToolbarContent({
  editor,
  activeSnote,
  currentContent,
  avChainUses,
  avChainMethods,
  mySecNotes,
  setActiveWindowId,
  theme
}) {
  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);
  const [isIconOpen, setIsIconOpen] = useState(false);
  const whenUndefined = theme === 0 ? "#000000" : "#ffffff"

  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      heading: ctx.editor.isActive("heading", { level: 2 }),
      bold: ctx.editor.isActive("bold"),
      italic: ctx.editor.isActive("italic"),
      underline: ctx.editor.isActive("underline"),
      highlight: ctx.editor.isActive("highlight"),

      alignLeft: ctx.editor.isActive({
        textAlign: "left",
      }),

      alignCenter: ctx.editor.isActive({
        textAlign: "center",
      }),

      alignRight: ctx.editor.isActive({
        textAlign: "right",
      }),

      bulletList: ctx.editor.isActive("bulletList"),
      taskList: ctx.editor.isActive("taskList"),
      codeBlock: ctx.editor.isActive("codeBlock"),
      link: ctx.editor.isActive("link"),

      fontSize:
        ctx.editor.getAttributes("textStyle").fontSize ||
        "16px",

      color:
        ctx.editor.getAttributes("textStyle").color ||
        whenUndefined,
    }),
  });

  return (
    <div className="toolbar">

      <div className="sizeNcolor">

        <div className="fontSizePicker">
          <span className="fontSizeIcon">
            T
          </span>

          <select
            className="fontSizeSelect"
            value={editorState.fontSize}
            onChange={(e) =>
              editor
                .chain()
                .focus()
                .setFontSize(e.target.value)
                .run()
            }
            title="Font Size"
          >
            <option value="12px">12px</option>
            <option value="14px">14px</option>
            <option value="16px">16px</option>
            <option value="18px">18px</option>
            <option value="24px">24px</option>
            <option value="32px">32px</option>
            <option value="36px">36px</option>
            <option value="48px">48px</option>
            <option value="60px">60px</option>
            <option value="72px">72px</option>
          </select>
        </div>

        <label
          className="colorPicker"
          title="Text Color"
        >
          <input
            type="color"
            value={editorState.color}
            onChange={(e) =>
              editor
                .chain()
                .focus()
                .setColor(e.target.value)
                .run()
            }
          />

          <span
            className="colorPickerIndicator"
            style={{
              backgroundColor: editorState.color,
            }}
          />

          <span className="colorPickerValue">
            {editorState.color}
          </span>
        </label>

      </div>

      <button
        className={editorState.heading ? "active" : ""}
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleHeading({ level: 2 })
            .run()
        }
        title="Heading"
      >
        <Heading2 size={18} />
      </button>

      <div className="TextStyle">

        <button
          className={editorState.bold ? "active" : ""}
          onClick={() =>
            editor.chain().focus().toggleBold().run()
          }
          title="Bold"
        >
          <Bold size={18} />
        </button>

        <button
          className={editorState.italic ? "active" : ""}
          onClick={() =>
            editor.chain().focus().toggleItalic().run()
          }
          title="Italic"
        >
          <Italic size={18} />
        </button>

        <button
          className={editorState.underline ? "active" : ""}
          onClick={() =>
            editor.chain().focus().toggleUnderline().run()
          }
          title="Underline"
        >
          <UnderlineIcon size={18} />
        </button>

        <button
          className={editorState.highlight ? "active" : ""}
          onClick={() =>
            editor.chain().focus().toggleHighlight().run()
          }
          title="Highlight"
        >
          <Highlighter size={18} />
        </button>

      </div>

      <div className="TextPositioning">

        <button
          className={editorState.alignLeft ? "active" : ""}
          onClick={() =>
            editor
              .chain()
              .focus()
              .setTextAlign("left")
              .run()
          }
          title="Align Left"
        >
          <AlignLeft size={18} />
        </button>

        <button
          className={editorState.alignCenter ? "active" : ""}
          onClick={() =>
            editor
              .chain()
              .focus()
              .setTextAlign("center")
              .run()
          }
          title="Align Center"
        >
          <AlignCenter size={18} />
        </button>

        <button
          className={editorState.alignRight ? "active" : ""}
          onClick={() =>
            editor
              .chain()
              .focus()
              .setTextAlign("right")
              .run()
          }
          title="Align Right"
        >
          <AlignRight size={18} />
        </button>

      </div>

      <div className="TextFormatting">

        <button
          className={editorState.bulletList ? "active" : ""}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBulletList()
              .run()
          }
          title="Bullet List"
        >
          <List size={18} />
        </button>

        <button
          className={editorState.taskList ? "active" : ""}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleTaskList()
              .run()
          }
          title="Checklist"
        >
          <ListChecks size={18} />
        </button>

        <button
          className={editorState.codeBlock ? "active" : ""}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleCodeBlock()
              .run()
          }
          title="Code Block"
        >
          <Code size={18} />
        </button>

      </div>

<div className="linkButtonWrapper">
  <button
    onClick={() => {
      setIsIconOpen((prev) => !prev);
      setIsLinkOpen(false);
      setIsReferenceOpen(false);
    }}
    title="Insert Icon"
  >
    <Loader size={18} /> 
  </button>

  {isIconOpen && <IconPopover editor={editor} onClose={() => setIsIconOpen(false)} whenUndefined={whenUndefined} />}
</div>

      <div className="linkButtonWrapper">

        <button
          className={editorState.link ? "active" : ""}
          onClick={() => {
            if (editorState.link) {
              editor.commands.unsetMark("link", {
                extendEmptyMarkRange: false,
              });

              editor.commands.focus();
            } else {
              setIsLinkOpen((prev) => !prev);
              setIsReferenceOpen(false);
            }
          }}
          title="Link"
        >
          <LinkIcon size={18} />
        </button>

        {isLinkOpen && (
          <LinkPopover
            editor={editor}
            onClose={() => setIsLinkOpen(false)}
          />
        )}

      </div>

      <div className="linkButtonWrapper">

        <button
          onClick={() => {
            setIsReferenceOpen((prev) => !prev);
            setIsLinkOpen(false);
          }}
          title="Reference"
        >
          <span
            style={{
              fontSize: "18px",
              fontWeight: "500",
            }}
          >
            ( )
          </span>
        </button>

        {isReferenceOpen && (
          <ReferencePopover
            editor={editor}
            avChainMethods={avChainMethods}
            avChainUses={avChainUses}
            mySecNotes={mySecNotes}
            setActiveWindowId={setActiveWindowId}
            theme={theme}
            onClose={() => setIsReferenceOpen(false)}
          />
        )}

      </div>

    </div>
  );
}