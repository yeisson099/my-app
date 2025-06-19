export type Advisor = {
    id: number;
    name: string;
    avatar: string;
    email: string;
    phone: string;
    address: string;
    income: number;
};

export type AdvisorPayload = Omit<Advisor, 'id'>;

export type AdvisorUpdatePayload = Partial<AdvisorPayload>;
