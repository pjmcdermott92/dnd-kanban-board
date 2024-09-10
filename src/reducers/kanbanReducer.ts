import { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Reducer } from 'react';
import { Column, Id, Task } from '../types';

export enum ActionTypes {
    LOAD_FROM_STORAGE,
    CREATE_COLUMN,
    DELETE_COLUMN,
    UPDATE_COLUMN,
    CREATE_TASK,
    DELETE_TASK,
    UPDATE_TASK,
    DRAG_START,
    DRAG_END,
    DRAG_OVER,
}

export type StoragePayload = {
    columns: Column[] | [];
    tasks: Task[] | [];
};

export type KanbanBoardState = StoragePayload & {
    activeColumn: Column | null;
    activeTask: Task | null;
};

export type KanbanAction =
    | { type: ActionTypes.LOAD_FROM_STORAGE; payload: StoragePayload }
    | { type: ActionTypes.CREATE_COLUMN; payload: null }
    | { type: ActionTypes.DELETE_COLUMN; payload: Id }
    | { type: ActionTypes.UPDATE_COLUMN; payload: { id: Id; title: string } }
    | { type: ActionTypes.CREATE_TASK; payload: Id }
    | { type: ActionTypes.DELETE_TASK; payload: Id }
    | { type: ActionTypes.UPDATE_TASK; payload: { id: Id; content: string } }
    | { type: ActionTypes.DRAG_START; payload: DragStartEvent }
    | { type: ActionTypes.DRAG_END; payload: DragEndEvent }
    | { type: ActionTypes.DRAG_OVER; payload: DragOverEvent };

const generateId = () => Math.floor(Math.random() * 10001);

export const kanbanReducer: Reducer<KanbanBoardState, KanbanAction> = (
    state,
    action
): KanbanBoardState => {
    switch (action.type) {
        case ActionTypes.LOAD_FROM_STORAGE:
            return {
                ...state,
                columns: action.payload.columns,
                tasks: action.payload.tasks,
            };
        case ActionTypes.CREATE_COLUMN:
            return {
                ...state,
                columns: [
                    ...state.columns,
                    { id: generateId(), title: `Column ${state.columns.length + 1}` },
                ],
            };
        case ActionTypes.DELETE_COLUMN:
            return {
                ...state,
                columns: state.columns.filter(col => col.id !== action.payload),
                tasks: state.tasks.filter(task => task.columnId !== action.payload),
            };
        case ActionTypes.UPDATE_COLUMN:
            return {
                ...state,
                columns: state.columns.map(col => {
                    if (col.id !== action.payload.id) return col;
                    return { ...col, title: action.payload.title };
                }),
            };
        case ActionTypes.CREATE_TASK:
            return {
                ...state,
                tasks: [
                    ...state.tasks,
                    {
                        id: generateId(),
                        columnId: action.payload,
                        content: `Task ${state.tasks.length + 1}`,
                    },
                ],
            };
        case ActionTypes.DELETE_TASK:
            return {
                ...state,
                tasks: state.tasks.filter(task => task.id !== action.payload),
            };
        case ActionTypes.UPDATE_TASK:
            return {
                ...state,
                tasks: state.tasks.map(task => {
                    if (task.id !== action.payload.id) return task;
                    return { ...task, content: action.payload.content };
                }),
            };
        case ActionTypes.DRAG_START: {
            const { payload } = action;

            if (payload.active.data.current?.type === 'Column') {
                return {
                    ...state,
                    activeColumn: payload.active.data.current.column,
                };
            }

            if (payload.active.data.current?.type === 'Task') {
                return {
                    ...state,
                    activeTask: payload.active.data.current.task,
                };
            }

            return state;
        }
        case ActionTypes.DRAG_END: {
            const { active, over } = action.payload;
            if (!over)
                return {
                    ...state,
                    activeColumn: null,
                    activeTask: null,
                };
            if (active.id === over.id)
                return {
                    ...state,
                    activeColumn: null,
                    activeTask: null,
                };

            const activeColIdx = state.columns.findIndex(col => col.id == active.id);
            const overColIdx = state.columns.findIndex(col => col.id == over.id);
            return {
                ...state,
                activeColumn: null,
                activeTask: null,
                columns: arrayMove(state.columns, activeColIdx, overColIdx),
            };
        }
        case ActionTypes.DRAG_OVER: {
            const { active, over } = action.payload;
            if (!over) return state;

            const activeId = active.id;
            const overId = over.id;

            if (activeId === overId) return state;

            const isActiveATask = active.data.current?.type === 'Task';
            const isOverATask = over.data.current?.type === 'Task';

            if (!isActiveATask) return state;

            // Dropping a task over another task
            if (isActiveATask && isOverATask) {
                return {
                    ...state,
                    tasks: (() => {
                        const activeIdx = state.tasks.findIndex(t => t.id === activeId);
                        const overIdx = state.tasks.findIndex(t => t.id == overId);

                        state.tasks[activeIdx].columnId = state.tasks[overIdx].columnId;
                        return arrayMove(state.tasks, activeIdx, overIdx);
                    })(),
                };
            }

            // Dropping task over column
            const isOverAColumn = over.data.current?.type === 'Column';
            if (isActiveATask && isOverAColumn) {
                return {
                    ...state,
                    tasks: (() => {
                        const activeIdx = state.tasks.findIndex(t => t.id === activeId);
                        state.tasks[activeIdx].columnId = overId;
                        return arrayMove(state.tasks, activeIdx, activeIdx);
                    })(),
                };
            }
            return state;
        }
        default:
            return state;
    }
};
