export type UserAccountRegistrationRequest = {
    name: string;
    email?: string;
    phone?: string;
    password?: string;
    sendAccountConfirmation?: boolean;
    collectionId?: string;
    tokenType?: 'bearer' | 'firebase';
};
