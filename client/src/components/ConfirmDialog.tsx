interface Props {
    message: string
    onConfirm: () => void
    onCancel: () => void
}

export default function ConfirmDialog({ message, onConfirm, onCancel }: Props) {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 w-full max-w-sm shadow-xl">
                <p className="text-sm text-stone-700 mb-6">{message}</p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm text-stone-500 hover:text-stone-800 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}