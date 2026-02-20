export type Sheet = {
    id: string,
    title: string,
    key: string | null,
    composer: string,
    sourceId: number | null,
    sourceTitle: string | null,
    levelId: number | null,
    levelName: string | null,
    genreId: number | null,
    genreName: string | null,
    examPiece: boolean
}

export type SheetFormData = {
    title: string,
    key: string | null,
    composer: string,
    sourceId: number | null,
    levelId: number | null,
    genreId: number | null,
    examPiece: boolean
}