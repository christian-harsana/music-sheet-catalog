export type AuthUser = {
    id: string,
    email: string,
    name: string
}

export type AuthUserWithToken = AuthUser & {
    token: string
}