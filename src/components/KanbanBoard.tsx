import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { useKanbanContext } from '../hooks/useKanbanContext';
import PlusIcon from '../icons/PlusIcon';
import ColumnContainer from './ColumnContainer';
import TaskCard from './TaskCard';

export default function KanbanBoard() {
    const {
        columns,
        activeColumn,
        activeTask,
        columnsIds,
        createNewColumn,
        onDragStart,
        onDragEnd,
        onDragOver,
    } = useKanbanContext();

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 3 } }));

    return (
        <div className='m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]'>
            <DndContext
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDragOver={onDragOver}
                sensors={sensors}
            >
                <div className='m-auto flex gap-4'>
                    <div className='flex gap-4'>
                        <SortableContext items={columnsIds}>
                            {columns.map(column => (
                                <ColumnContainer key={column.id} column={column} />
                            ))}
                        </SortableContext>
                    </div>
                    <button
                        onClick={createNewColumn}
                        className='flex gap-2 h-[60px] w-[350px] min-w-[350px] cursor-point rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2'
                    >
                        <PlusIcon /> Add Column
                    </button>
                </div>

                {createPortal(
                    <DragOverlay>
                        {activeColumn && <ColumnContainer column={activeColumn} />}
                        {activeTask && <TaskCard task={activeTask} />}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>
        </div>
    );
}
