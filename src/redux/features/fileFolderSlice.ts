import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export type NodeType = "file" | "folder";

export interface TData {
  id: string;
  name: string;
  type: NodeType;
  parentId: string | null;
  content?: string;
}

export interface FileFolderState {
  items: TData[];
}

const initialState: FileFolderState = {
  items: [],
};

export const fileFolderSlice = createSlice({
  name: "fileFolder",
  initialState,
  reducers: {
    createFileOrFolder: (
      state,
      action: PayloadAction<{
        name: string;
        type: NodeType;
        parentId: string | null;
      }>,
    ) => {
      const newItem: TData = {
        id: (state.items.length + 1).toString(),
        name: action.payload.name,
        type: action.payload.type,
        parentId: action.payload.parentId,
        ...(action.payload.type === "file" && {
          content: "",
        }),
      };

      state.items.push(newItem);
    },

    deleteFileOrFolder: (state, action: PayloadAction<string>) => {
      const idToDelete = action.payload;

      const getIdsToDelete = (currentId: string): string[] => {
        let ids = [currentId];

        state.items.forEach((item) => {
          if (item.parentId === currentId) {
            ids = [...ids, ...getIdsToDelete(item.id)];
          }
        });

        return ids;
      };

      const allIdsToDelete = getIdsToDelete(idToDelete);

      state.items = state.items.filter((item) => !allIdsToDelete.includes(item.id));
    },

    updateFileOrFolder: (state, action: PayloadAction<{ id: string; name: string }>) => {
      const item = state.items.find((item) => item.id === action.payload.id);

      if (item) {
        item.name = action.payload.name;
      }
    },

    updateFileContent: (state, action: PayloadAction<{ id: string; content: string }>) => {
      const item = state.items.find((item) => item.id === action.payload.id);

      if (item?.type === "file") {
        item.content = action.payload.content;
      }
    },
  },
});

export const { createFileOrFolder, deleteFileOrFolder, updateFileOrFolder, updateFileContent } =
  fileFolderSlice.actions;

export default fileFolderSlice.reducer;
