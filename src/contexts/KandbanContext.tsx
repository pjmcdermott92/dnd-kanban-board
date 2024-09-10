import { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { createContext, useEffect, useMemo, useReducer } from 'react';
import {
    ActionTypes,
    KanbanBoardState,
    kanbanReducer,
    StoragePayload,
} from '../reducers/kanbanReducer';
import { Column, Id, Task } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

type KanbanContextType = {
    columns: Column[];
    tasks: Task[];
    activeColumn: Column | null;
    activeTask: Task | null;
    columnsIds: Id[];
    createNewColumn: () => void;
    deleteColumn: (id: Id) => void;
    updateColumn: (id: Id, title: string) => void;
    createTask: (columnId: Id) => void;
    deleteTask: (taskId: Id) => void;
    updateTask: (id: Id, content: string) => void;
    onDragStart: (e: DragStartEvent) => void;
    onDragEnd: (e: DragEndEvent) => void;
    onDragOver: (e: DragOverEvent) => void;
};

export const KanbanContext = createContext({} as KanbanContextType);

const initialState: KanbanBoardState = {
    columns: [],
    tasks: [],
    activeColumn: null,
    activeTask: null,
};

export const KanbanProvider = ({ children }: { children: React.ReactNode }) => {
    const [storedState, setStoredState] = useLocalStorage<StoragePayload>('kanbanItems', {
        columns: [],
        tasks: [],
    });
    const [state, dispatch] = useReducer(kanbanReducer, initialState, initial => ({
        ...initial,
        ...storedState,
    }));

    // Save to localStorage on state change
    useEffect(
        () => setStoredState({ columns: state.columns, tasks: state.tasks }),
        [state, setStoredState]
    );

    const columnsIds = useMemo(() => state.columns.map(col => col.id), [state.columns]);

    return (
        <KanbanContext.Provider
            value={{
                ...state,
                columnsIds,
                createNewColumn: () => dispatch({ type: ActionTypes.CREATE_COLUMN, payload: null }),
                deleteColumn: (id: Id) =>
                    dispatch({ type: ActionTypes.DELETE_COLUMN, payload: id }),
                updateColumn: (id: Id, title: string) =>
                    dispatch({ type: ActionTypes.UPDATE_COLUMN, payload: { id, title } }),
                createTask: (colId: Id) =>
                    dispatch({ type: ActionTypes.CREATE_TASK, payload: colId }),
                updateTask: (id: Id, content: string) =>
                    dispatch({ type: ActionTypes.UPDATE_TASK, payload: { id, content } }),
                deleteTask: (taskId: Id) =>
                    dispatch({ type: ActionTypes.DELETE_TASK, payload: taskId }),
                onDragStart: (e: DragStartEvent) =>
                    dispatch({ type: ActionTypes.DRAG_START, payload: e }),
                onDragEnd: (e: DragEndEvent) =>
                    dispatch({ type: ActionTypes.DRAG_END, payload: e }),
                onDragOver: (e: DragOverEvent) =>
                    dispatch({ type: ActionTypes.DRAG_OVER, payload: e }),
            }}
        >
            {children}
        </KanbanContext.Provider>
    );
};
