export type Sheet = {
    id: string,
    title: string,
    key: string | null,
    sourceId: string | null,
    sourceTitle: string | null,
    levelId: string | null,
    levelName: string | null,
    genreId: string | null,
    genreName: string | null
}

export type SheetFormData = {
    title: string,
    key: string | null,
    sourceId: string | null,
    levelId: string | null,
    genreId: string | null
}