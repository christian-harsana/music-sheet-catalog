import IconSpinner from "./IconSpinner";

export default function Loading() {
    return (
        <div className="flex gap-4">
            <IconSpinner />
            <span>Loading...</span>
        </div>
    )
}