import IconSpinner from "./IconSpinner"

export default function Loading() {
    return (
        <div className="flex gap-3">
            <IconSpinner color={"dark"} />
            <span>Loading...</span>
        </div>
    )
}