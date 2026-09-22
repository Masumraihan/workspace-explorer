import { IconFolderCode } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function EmptyFile() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant='icon'>
          <IconFolderCode />
        </EmptyMedia>
        <EmptyTitle>No Projects Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any projects yet. Get started by creating your first project.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className='flex-row justify-center gap-2'>
        <Button>Create Project</Button>
        <Button variant='outline'>Import Project</Button>
      </EmptyContent>
    </Empty>
  );
}
