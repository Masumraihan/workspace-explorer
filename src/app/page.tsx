"use client";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  File,
  FilePlus,
  FileText,
  Folder,
  FolderOpen,
  FolderPlus,
} from "lucide-react";
import { useState } from "react";

type NodeType = "file" | "folder";

type TNode = {
  id: string;
  name: string;
  type: NodeType;
  parentId: string | null;
};

type DraftType = {
  parentId: string | null;
  type: NodeType;
};

const initialData: TNode[] = [
  { id: "1", name: "src", type: "folder", parentId: null },
  { id: "2", name: "components", type: "folder", parentId: "1" },
  { id: "3", name: "Button.txt", type: "file", parentId: "2" },
  { id: "4", name: "index.txt", type: "file", parentId: "1" },
  { id: "5", name: "notes.txt", type: "file", parentId: null },
  { id: "6", name: "README.txt", type: "file", parentId: null },
];

function EmptyState() {
  return (
    <div className='flex h-full flex-col items-center justify-center gap-2 text-muted-foreground'>
      <FileText size={32} strokeWidth={1.25} />
      <p className='text-sm'>No file open</p>
      <p className='text-xs'>Select a file from the explorer to view it here</p>
    </div>
  );
}

function TreeNode({
  node,
  depth,
  nodes,
  expanded,
  selectedId,
  draft,
  draftName,
  onToggle,
  onSelect,
  onStartCreate,
  onDraftChange,
  onCommitDraft,
  onCancelDraft,
}: {
  node: TNode;
  depth: number;
  nodes: TNode[];
  expanded: Set<string>;
  selectedId: string | null;
  draft: DraftType | null;
  draftName: string;
  onToggle: (id: string) => void;
  onSelect: (node: TNode) => void;
  onStartCreate: (parentId: string, type: NodeType) => void;
  onDraftChange: (value: string) => void;
  onCommitDraft: () => void;
  onCancelDraft: () => void;
}) {
  const isFolder = node.type === "folder";
  const isOpen = expanded.has(node.id);
  const isSelected = selectedId === node.id;
  const children = nodes.filter((n) => n.parentId === node.id);
  const Icon = isFolder ? (isOpen ? FolderOpen : Folder) : File;

  return (
    <div>
      <div
        className={cn(
          "group flex items-center gap-1 rounded-sm px-1 py-0.75 text-[13px] cursor-pointer select-none hover:bg-accent",
          isSelected && "bg-accent",
        )}
        style={{ paddingLeft: depth * 14 + 4 }}
        onClick={() => (isFolder ? onToggle(node.id) : onSelect(node))}
      >
        {isFolder ? (
          isOpen ? (
            <ChevronDown size={14} className='shrink-0 text-muted-foreground' />
          ) : (
            <ChevronRight size={14} className='shrink-0 text-muted-foreground' />
          )
        ) : (
          <span className='w-3.5 shrink-0' />
        )}
        <Icon size={15} className='shrink-0 text-muted-foreground' />
        <span className='truncate'>{node.name}</span>
        {isFolder && (
          <span className='ml-auto hidden items-center gap-0.5 group-hover:flex'>
            <span
              className='cursor-pointer p-0.5 hover:scale-105'
              onClick={(e) => {
                e.stopPropagation();
                if (!isOpen) onToggle(node.id);
                onStartCreate(node.id, "file");
              }}
            >
              <FilePlus size={13} />
            </span>
            <span
              className='cursor-pointer p-0.5 hover:scale-105'
              onClick={(e) => {
                e.stopPropagation();
                if (!isOpen) onToggle(node.id);
                onStartCreate(node.id, "folder");
              }}
            >
              <FolderPlus size={13} />
            </span>
          </span>
        )}
      </div>

      {isFolder && isOpen && (
        <div>
          {children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              nodes={nodes}
              expanded={expanded}
              selectedId={selectedId}
              draft={draft}
              draftName={draftName}
              onToggle={onToggle}
              onSelect={onSelect}
              onStartCreate={onStartCreate}
              onDraftChange={onDraftChange}
              onCommitDraft={onCommitDraft}
              onCancelDraft={onCancelDraft}
            />
          ))}
          {draft && draft.parentId === node.id && (
            <DraftRow
              depth={depth + 1}
              type={draft.type}
              value={draftName}
              onChange={onDraftChange}
              onCommit={onCommitDraft}
              onCancel={onCancelDraft}
            />
          )}
        </div>
      )}
    </div>
  );
}

function DraftRow({
  depth,
  type,
  value,
  onChange,
  onCommit,
  onCancel,
}: {
  depth: number;
  type: NodeType;
  value: string;
  onChange: (value: string) => void;
  onCommit: () => void;
  onCancel: () => void;
}) {
  const Icon = type === "folder" ? Folder : File;
  return (
    <div className='flex items-center gap-1 px-1 py-0.75' style={{ paddingLeft: depth * 14 + 4 }}>
      <span className='w-3.5 shrink-0' />
      <Icon size={15} className='shrink-0 text-muted-foreground' />
      <input
        autoFocus
        value={value}
        placeholder={type === "folder" ? "Folder name" : "File name"}
        className='w-full rounded-sm border border-ring bg-background px-1 py-0 text-[13px] outline-none'
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onCommit();
          if (e.key === "Escape") onCancel();
        }}
        onBlur={onCommit}
      />
    </div>
  );
}

export default function Home() {
  const [nodes, setNodes] = useState<TNode[]>(initialData);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["1", "2"]));
  const [selected, setSelected] = useState<TNode | null>(null);
  const [draft, setDraft] = useState<DraftType | null>(null);
  const [draftName, setDraftName] = useState("");

  const toggleFolder = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectFile = (node: TNode) => {
    setSelected(node);
    console.log(node);
  };

  const startCreate = (parentId: string | null, type: NodeType) => {
    setDraft({ parentId, type });
    setDraftName("");
  };

  const commitDraft = () => {
    if (!draft) return;
    let name = draftName.trim();
    if (name.length === 0) {
      setDraft(null);
      return;
    }
    if (draft.type === "file" && !name.endsWith(".txt")) {
      name = `${name}.txt`;
    }
    const newNode: TNode = {
      id: "3",
      name,
      type: draft.type,
      parentId: draft.parentId,
    };
    setNodes((prev) => [...prev, newNode]);
    console.log(newNode);
    setDraft(null);
    setDraftName("");
  };

  const cancelDraft = () => {
    setDraft(null);
    setDraftName("");
  };

  const rootNodes = nodes.filter((n) => n.parentId === null);

  return (
    <div className='h-screen bg-background text-foreground'>
      <ResizablePanelGroup orientation='horizontal' className='h-screen min-h-50 rounded-lg border'>
        <ResizablePanel defaultSize='20%' minSize='15%' maxSize='40%'>
          <div className='flex h-full flex-col'>
            <div className='flex items-center justify-between px-3 py-2'>
              <span className='text-[11px] font-medium tracking-wide text-muted-foreground'>
                EXPLORER
              </span>
              <div className='flex items-center gap-1'>
                <span
                  className='cursor-pointer p-1 hover:scale-105'
                  onClick={() => startCreate(null, "file")}
                >
                  <FilePlus size={20} />
                </span>
                <span
                  className='cursor-pointer p-1 hover:scale-105'
                  onClick={() => startCreate(null, "folder")}
                >
                  <FolderPlus size={20} />
                </span>
              </div>
            </div>
            <div className='flex-1 overflow-y-auto px-1 pb-2'>
              {rootNodes.map((node) => (
                <TreeNode
                  key={node.id}
                  node={node}
                  depth={0}
                  nodes={nodes}
                  expanded={expanded}
                  selectedId={selected?.id ?? null}
                  draft={draft}
                  draftName={draftName}
                  onToggle={toggleFolder}
                  onSelect={selectFile}
                  onStartCreate={startCreate}
                  onDraftChange={setDraftName}
                  onCommitDraft={commitDraft}
                  onCancelDraft={cancelDraft}
                />
              ))}
              {draft && draft.parentId === null && (
                <DraftRow
                  depth={0}
                  type={draft.type}
                  value={draftName}
                  onChange={setDraftName}
                  onCommit={commitDraft}
                  onCancel={cancelDraft}
                />
              )}
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize='80%'>
          <div className='flex h-full flex-col'>
            {selected && (
              <div className='flex items-center gap-2 border-b px-4 py-2 text-[13px] text-muted-foreground'>
                <File size={14} />
                {selected.name}
              </div>
            )}
            <div className='flex-1'>
              {selected ? (
                <div className='p-4 text-sm text-muted-foreground'>
                  Contents of {selected.name} would render here
                </div>
              ) : (
                <EmptyState />
              )}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
