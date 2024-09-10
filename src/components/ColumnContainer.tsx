import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMemo, useState } from 'react';
import { useKanbanContext } from '../hooks/useKanbanContext';
import PlusIcon from '../icons/PlusIcon';
import { Column } from '../types';
import DeleteButton from './DeleteButton';
import TaskCard from './TaskCard';

export default function ColumnContainer({ column }: { column: Column }) {
    const { tasks: allTasks, deleteColumn, updateColumn, createTask } = useKanbanContext();
    const [editMode, setEditMode] = useState<boolean>(false);

    const tasks = useMemo(
        () => allTasks.filter(task => task.columnId === column.id) || [],
        [allTasks, column.id]
    );

    const tasksIds = useMemo(() => tasks.map(task => task.id), [tasks]);

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: {
            type: 'Column',
            column,
        },
        disabled: editMode,
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    const columnContainerClasses =
        'bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col';

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className={`${columnContainerClasses} opacity-40 border border-r-columnBackgroundColor`}
            ></div>
        );
    }

    return (
        <div ref={setNodeRef} style={style} className={columnContainerClasses}>
            <div
                {...attributes}
                {...listeners}
                onClick={() => setEditMode(true)}
                className='bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBackgroundColor border-4 flex items-center justify-between relative'
            >
                <div className='flex gap-2'>
                    <div className='flex justify-center items-center bg-columnBackgroundColor px-2 py-1 text-sm rounded-full'>
                        {tasks.length}
                    </div>
                    {!editMode ? (
                        column.title
                    ) : (
                        <input
                            className='bg-black focus:border-rose-500 border rounded outline-none px-2'
                            value={column.title}
                            onChange={e => updateColumn(column.id, e.target.value)}
                            autoFocus
                            onBlur={() => setEditMode(false)}
                            onKeyDown={e => {
                                if (e.key !== 'Enter') return;
                                setEditMode(false);
                            }}
                        />
                    )}
                </div>
                <DeleteButton onClick={() => deleteColumn(column.id)} />
            </div>
            <div className='flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto'>
                <SortableContext items={tasksIds}>
                    {tasks.map(task => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </SortableContext>
            </div>
            <button
                onClick={() => createTask(column.id)}
                className='flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-rose-500 active:bg-black'
            >
                <PlusIcon /> Add Task
            </button>
        </div>
    );
}
