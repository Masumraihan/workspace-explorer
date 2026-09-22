import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

export default function Home() {
  return (
    <div className='h-screen'>
      <ResizablePanelGroup orientation='horizontal' className='min-h-50 h-screen rounded-lg border'>
        <ResizablePanel defaultSize='10%'>
          <div className='flex h-full justify-center p-6'>
            <div>
              <span className='font-bold text-2xl'>Brand Logo</span>
            </div>
            <div></div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize='75%'>
          <div className='flex h-full items-center justify-center p-6'>
            <span className='font-semibold'>Content</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
