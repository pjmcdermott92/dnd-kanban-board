import KanbanBoard from './components/KanbanBoard';
import { KanbanProvider } from './contexts/KandbanContext';

export default function App() {
    return (
        <KanbanProvider>
            <KanbanBoard />
        </KanbanProvider>
    );
}
