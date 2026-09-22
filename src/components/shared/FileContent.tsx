"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { updateFileContent } from "@/redux/features/fileFolderSlice";

type FileContentProps = {
  fileId: string;
};

const FileContent = ({ fileId }: FileContentProps) => {
  const dispatch = useDispatch();

  const file = useSelector((state: RootState) =>
    state.fileFolders.items.find((item) => item.id === fileId && item.type === "file"),
  );

  if (!file) {
    return null;
  }

  return (
    <div className='flex h-full flex-col'>
      <textarea
        value={file.content ?? ""}
        onChange={(event) =>
          dispatch(
            updateFileContent({
              id: file.id,
              content: event.target.value,
            }),
          )
        }
        placeholder='Start writing...'
        className='h-full w-full resize-none border-0 bg-transparent p-4 text-sm outline-none'
        spellCheck={false}
      />
    </div>
  );
};

export default FileContent;
