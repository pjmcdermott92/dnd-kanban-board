import TrashIcon from '../icons/TrashIcon';

interface Props {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function DeleteButton({ onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className='stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-columnBackgroundColor p-2 rounded opacity-60 hover:opacity-100'
        >
            <TrashIcon />
        </button>
    );
}
