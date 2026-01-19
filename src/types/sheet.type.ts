export type Sheet = {
    id: string,
    title: string,
    sourceId: string | null,
    sourceTitle: string | null,
    levelId: string | null,
    levelName: string | null,
    genreId: string | null,
    genreName: string | null
}

export type SheetFormData = {
    title: string,
    sourceId: string | null,
    levelId: string | null,
    genreId: string | null
}