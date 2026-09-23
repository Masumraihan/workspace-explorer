"use client";

import { useDispatch, useSelector } from "react-redux";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  File,
  FilePlus,
  Folder,
  FolderOpen,
  FolderPlus,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { RootState } from "@/redux/store";
import {
  createFileOrFolder,
  deleteFileOrFolder,
  updateFileOrFolder,
} from "@/redux/features/fileFolderSlice";

export type TData = {
  id: string;
  name: string;
  type: "file" | "folder";
  parentId: string | null;
};

type DraftType = {
  parentId: string | null;
  type: TData["type"];
};

const TreeNode = ({
  node,
  depth,
  nodes,
  expanded,
  selectedId,
  draft,
  draftName,
  renamingId,
  renameValue,
  onToggle,
  onSelect,
  onStartCreate,
  onDraftChange,
  onCommitDraft,
  onCancelDraft,
  onStartRename,
  onRenameChange,
  onCommitRename,
  onCancelRename,
  onDeleteRequest,
  openMenuId,
  onOpenMenuChange,
}: {
  node: TData;
  depth: number;
  nodes: TData[];
  expanded: Set<string>;
  selectedId: string | null;
  draft: DraftType | null;
  draftName: string;
  renamingId: string | null;
  renameValue: string;
  onToggle: (id: string) => void;
  onSelect: (node: TData) => void;
  onStartCreate: (parentId: string, type: TData["type"]) => void;
  onDraftChange: (value: string) => void;
  onCommitDraft: () => void;
  onCancelDraft: () => void;
  onStartRename: (node: TData) => void;
  onRenameChange: (value: string) => void;
  onCommitRename: () => void;
  onCancelRename: () => void;
  onDeleteRequest: (node: TData) => void;
  openMenuId: string | null;
  onOpenMenuChange: (id: string, open: boolean) => void;
}) => {
  const isFolder = node.type === "folder";
  const isOpen = expanded.has(node.id);
  const isSelected = selectedId === node.id;
  const children = nodes.filter((n) => n.parentId === node.id);
  const Icon = isFolder ? (isOpen ? FolderOpen : Folder) : File;
  const isRenaming = renamingId === node.id;

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

        {isRenaming ? (
          <input
            autoFocus
            value={renameValue}
            className='w-full rounded-sm border border-ring bg-background px-1 py-0 text-[13px] outline-none'
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onRenameChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onCommitRename();
              if (e.key === "Escape") onCancelRename();
            }}
            onBlur={onCommitRename}
          />
        ) : (
          <span className='truncate'>{node.name}</span>
        )}

        {!isRenaming && (
          <span
            className={cn(
              "ml-auto flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100",
              openMenuId === node.id && "opacity-100",
            )}
          >
            {isFolder && (
              <>
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
              </>
            )}
            <DropdownMenu
              open={openMenuId === node.id}
              onOpenChange={(open) => onOpenMenuChange(node.id, open)}
            >
              <DropdownMenuTrigger data-slot='dropdown-menu-trigger' className={"h-3 relative"}>
                <span
                  className='cursor-pointer p-0.5 hover:scale-105 absolute top-1/2 transform -translate-y-1/2 right-0'
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal size={13} />
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='center' onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem onClick={() => onStartRename(node)}>
                  <Pencil size={13} className='mr-2' />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='text-destructive'
                  onClick={() => onDeleteRequest(node)}
                >
                  <Trash2 size={13} className='mr-2' />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
              renamingId={renamingId}
              renameValue={renameValue}
              onToggle={onToggle}
              onSelect={onSelect}
              onStartCreate={onStartCreate}
              onDraftChange={onDraftChange}
              onCommitDraft={onCommitDraft}
              onCancelDraft={onCancelDraft}
              onStartRename={onStartRename}
              onRenameChange={onRenameChange}
              onCommitRename={onCommitRename}
              onCancelRename={onCancelRename}
              onDeleteRequest={onDeleteRequest}
              openMenuId={openMenuId}
              onOpenMenuChange={onOpenMenuChange}
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
};

function DraftRow({
  depth,
  type,
  value,
  onChange,
  onCommit,
  onCancel,
}: {
  depth: number;
  type: TData["type"];
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

function getPath(node: TData, nodes: TData[]) {
  const parts: string[] = [];
  let current = node.parentId ? nodes.find((n) => n.id === node.parentId) : undefined;
  while (current) {
    parts.unshift(current.name);
    current = current.parentId ? nodes.find((n) => n.id === current!.parentId) : undefined;
  }
  return parts.join("/");
}

function SearchResults({
  query,
  results,
  nodes,
  onNavigate,
}: {
  query: string;
  results: TData[];
  nodes: TData[];
  onNavigate: (node: TData) => void;
}) {
  if (results.length === 0) {
    return (
      <p className='px-3 py-2 text-[13px] text-muted-foreground'>
        No results for &quot;{query}&quot;
      </p>
    );
  }

  return (
    <div>
      {results.map((node) => {
        const Icon = node.type === "folder" ? Folder : File;
        const path = getPath(node, nodes);
        return (
          <div
            key={node.id}
            className='flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1 text-[13px] hover:bg-accent'
            onClick={() => onNavigate(node)}
          >
            <Icon size={15} className='shrink-0 text-muted-foreground' />
            <span className='truncate'>{node.name}</span>
            {path && <span className='truncate text-xs text-muted-foreground'>{path}</span>}
          </div>
        );
      })}
    </div>
  );
}

export default function CollapsableFileTree({
  selected,
  onSelect,
}: {
  selected: TData | null;
  onSelect: (node: TData | null) => void;
}) {
  const nodes = useSelector((state: RootState) => state.fileFolders.items);
  const dispatch = useDispatch();

  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [draft, setDraft] = useState<DraftType | null>(null);
  const [draftName, setDraftName] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<TData | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleFolder = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const startCreate = (parentId: string | null, type: TData["type"]) => {
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
    if (draft.type === "file" && !name.includes(".")) {
      name = `${name}.txt`;
    }
    dispatch(
      createFileOrFolder({
        name,
        type: draft.type,
        parentId: draft.parentId,
      }),
    );
    setDraft(null);
    setDraftName("");
  };

  const cancelDraft = () => {
    setDraft(null);
    setDraftName("");
  };

  const startRename = (node: TData) => {
    setRenamingId(node.id);
    setRenameValue(node.name);
  };

  const commitRename = () => {
    if (!renamingId) return;
    const name = renameValue.trim();
    if (name.length > 0) {
      dispatch(updateFileOrFolder({ id: renamingId, name }));
    }
    setRenamingId(null);
    setRenameValue("");
  };

  const cancelRename = () => {
    setRenamingId(null);
    setRenameValue("");
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    dispatch(deleteFileOrFolder(deleteTarget.id));
    if (selected?.id === deleteTarget.id) onSelect(null);
    setDeleteTarget(null);
  };

  const handleOpenMenuChange = (id: string, open: boolean) => {
    setOpenMenuId(open ? id : null);
  };

  const expandToNode = (node: TData) => {
    const idsToExpand: string[] = node.type === "folder" ? [node.id] : [];
    let parentId = node.parentId;
    while (parentId) {
      idsToExpand.push(parentId);
      const parent = nodes.find((n) => n.id === parentId);
      parentId = parent ? parent.parentId : null;
    }
    setExpanded((prev) => new Set([...prev, ...idsToExpand]));
  };

  const navigateToResult = (node: TData) => {
    expandToNode(node);
    if (node.type === "file") onSelect(node);
    setSearchQuery("");
  };

  const rootNodes = nodes.filter((n) => n.parentId === null);
  const searchResults = nodes.filter((n) =>
    n.name.toLowerCase().includes(searchQuery.trim().toLowerCase()),
  );

  return (
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

      <div className='px-3 pb-2'>
        <div className='flex items-center gap-2 rounded-sm border px-2 py-1'>
          <Search size={13} className='shrink-0 text-muted-foreground' />
          <input
            value={searchQuery}
            placeholder='Search files and folders'
            className='w-full bg-transparent text-[13px] outline-none'
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <X
              size={13}
              className='shrink-0 cursor-pointer text-muted-foreground'
              onClick={() => setSearchQuery("")}
            />
          )}
        </div>
      </div>

      <div className='flex-1 overflow-y-auto px-1 pb-2'>
        {searchQuery.trim() ? (
          <SearchResults
            query={searchQuery}
            results={searchResults}
            nodes={nodes}
            onNavigate={navigateToResult}
          />
        ) : (
          <>
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
                renamingId={renamingId}
                renameValue={renameValue}
                onToggle={toggleFolder}
                onSelect={onSelect}
                onStartCreate={startCreate}
                onDraftChange={setDraftName}
                onCommitDraft={commitDraft}
                onCancelDraft={cancelDraft}
                onStartRename={startRename}
                onRenameChange={setRenameValue}
                onCommitRename={commitRename}
                onCancelRename={cancelRename}
                onDeleteRequest={setDeleteTarget}
                openMenuId={openMenuId}
                onOpenMenuChange={handleOpenMenuChange}
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
          </>
        )}
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='normal-case'>
              Delete {deleteTarget?.name}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.type === "folder"
                ? "This will delete the folder and everything inside it. This action cannot be undone."
                : "This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={"cursor-pointer"}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className={"bg-destructive cursor-pointer"}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
