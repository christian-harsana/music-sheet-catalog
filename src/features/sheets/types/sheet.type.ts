export type Sheet = {
    id: string,
    title: string,
    key: string | null,
    sourceId: number | null,
    sourceTitle: string | null,
    levelId: number | null,
    levelName: string | null,
    genreId: number | null,
    genreName: string | null
}

export type SheetFormData = {
    title: string,
    key: string | null,
    sourceId: number | null,
    levelId: number | null,
    genreId: number | null
}