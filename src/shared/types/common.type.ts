export type AuthUser = {
    id: string,
    email: string,
    name: string
}

export type AuthUserWithToken = AuthUser & {
    token: string
}

export type NotificationType = "success" | "error" | "info";

export type PaginationData = {
    currentPage: number,
    pageSize: number,
    totalItems: number,
    totalPages: number,
    hasNextPage: boolean,
    hasPreviousPage: boolean
}


export type ErrorHandlerOptions = {
    onUnauthorised?: () => void
}

export type ErrorContextType = {
  handleError: (error: unknown, options?: ErrorHandlerOptions) => void
}
