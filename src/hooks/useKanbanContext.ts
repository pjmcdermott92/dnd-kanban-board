import { useContext } from 'react';
import { KanbanContext } from '../contexts/KandbanContext';

export const useKanbanContext = () => useContext(KanbanContext);
