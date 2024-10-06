export interface User {
    _id?: string;
    id?: string;
    botUserId: number;
    name: string;
    isActivate: boolean;
    step: number;
    phone: string;
}