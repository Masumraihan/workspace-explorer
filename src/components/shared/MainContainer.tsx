"use client";

import CollapsableFileTree, { TData } from "@/components/shared/CollapsableFileTree";
import FileContent from "@/components/shared/FileContent";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { File, FileText } from "lucide-react";
import { useState } from "react";

const EmptyState = () => {
  return (
    <div className='flex h-full flex-col items-center justify-center gap-2 text-muted-foreground'>
      <FileText size={32} strokeWidth={1.25} />
      <p className='text-sm'>No file open</p>
      <p className='text-xs'>Select a file from the explorer to view it here</p>
    </div>
  );
};

const MainContainer = () => {
  const [selected, setSelected] = useState<TData | null>(null);

  return (
    <div className='h-screen bg-background text-foreground'>
      <ResizablePanelGroup orientation='horizontal' className='h-screen min-h-50 rounded-lg border'>
        <ResizablePanel defaultSize='20%' minSize='15%' maxSize='40%'>
          <CollapsableFileTree selected={selected} onSelect={setSelected} />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize='80%'>
          <div className='flex h-full flex-col'>
            {selected?.type === "file" && (
              <div className='flex items-center gap-2 border-b px-4 py-2 text-[13px] text-muted-foreground'>
                <File size={14} />
                {selected.name}
              </div>
            )}

            <div className='min-h-0 flex-1'>
              {selected?.type === "file" ? <FileContent fileId={selected.id} /> : <EmptyState />}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default MainContainer;
