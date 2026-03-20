export default function Toast({ message }: { message: string }) {
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-stone-900 text-white text-sm px-5 py-2.5 rounded-full shadow-lg whitespace-nowrap">
                {message}
            </div>
        </div>
    )
}