import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { useKanbanContext } from '../hooks/useKanbanContext';
import { Task } from '../types';
import DeleteButton from './DeleteButton';

export default function TaskCard({ task }: { task: Task }) {
    const { deleteTask, updateTask } = useKanbanContext();

    const [mouseIsOver, setMouseIsOver] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: task.id,
        data: {
            type: 'Task',
            task,
        },
        disabled: isEditing,
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    const toggleEditMode = () => {
        setIsEditing(prev => !prev);
        setMouseIsOver(false);
    };

    const taskCardClasses =
        'bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] flex items-center text-left rounded-xl';

    if (isDragging)
        return (
            <div
                ref={setNodeRef}
                style={style}
                className={`${taskCardClasses} border-2 border-rose-500 cursor-grab relative task opacity-30`}
            />
        );

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`${taskCardClasses} hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative task`}
            onMouseEnter={() => setMouseIsOver(true)}
            onMouseLeave={() => setMouseIsOver(false)}
            onClick={toggleEditMode}
        >
            {isEditing ? (
                <textarea
                    className='h-[90%] w-full resize-none rounded bg-transparent text-white focus:outline-none'
                    value={task.content}
                    autoFocus
                    placeholder='Task content here'
                    onBlur={toggleEditMode}
                    onKeyDown={e => {
                        if (e.key == 'Enter' && e.shiftKey) toggleEditMode();
                    }}
                    onChange={e => updateTask(task.id, e.target.value)}
                />
            ) : (
                <p className='my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap'>
                    {task.content}
                </p>
            )}
            {mouseIsOver && <DeleteButton onClick={() => deleteTask(task.id)} />}
        </div>
    );
}
