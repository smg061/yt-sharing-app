import { createContext, useContext, useReducer } from "react";

export type ToolbarState = {
  brushColor: string;
  brushSize: number;
  brushType: CanvasLineCap;
  isEraser: boolean;
};
export const ToolbarContext = createContext<{
  state: ToolbarState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export const initialState: ToolbarState = {
  brushColor: "#000000",
  brushSize: 10,
  brushType: "round",
  isEraser: false,
};

type ActionType =
  | "SET_BRUSH_COLOR"
  | "SET_BRUSH_SIZE"
  | "SET_BRUSH_TYPE"
  | "SET_IS_ERASER";

type Action =
  | {
      type: "SET_BRUSH_COLOR";
      payload: string;
    }
  | {
      type: "SET_BRUSH_SIZE";
      payload: number;
    }
  | {
      type: "SET_BRUSH_TYPE";
      payload: CanvasLineCap;
    }
  | {
      type: "SET_IS_ERASER";
      payload: boolean;
    };


const reducer = (state: ToolbarState, action: Action) => {
  switch (action.type) {
    case "SET_BRUSH_COLOR":
      return {
        ...state,
        brushColor: action.payload,
      };
    case "SET_BRUSH_SIZE":
      return {
        ...state,
        brushSize: action.payload,
      };
    case "SET_BRUSH_TYPE":
      return {
        ...state,
        brushType: action.payload,
      };
    case "SET_IS_ERASER":
      return {
        ...state,
        isEraser: action.payload,
      };
    default:
      return state;
  }
};

export default function ToolbarProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <ToolbarContext.Provider value={{ state, dispatch }}>
      {children}
    </ToolbarContext.Provider>
  );
}

export function useToolbarCtx() {
  const ctx = useContext(ToolbarContext);
  if (!ctx) throw new Error("useSocket must be used within a SocketProvider");
  return ctx;
}
