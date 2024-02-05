const Role ={
    user: "USER",
    admin: "ADMIN"
} as const;

export type Roles = typeof Role[keyof typeof Role];