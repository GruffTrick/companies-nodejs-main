export interface Company {
    type: "LTD"|"LLP"|"FXC"|"NPO";
    companyName?: string;
    registrationNumber?: string;
    registeredAddress?: string;
    active?: boolean;
    incorporatedOn?: Date;
}

export interface LimitedCompany extends Company {
    type: "LTD";
    numberOfShares?: number;
    plc?: boolean;
}

export interface LimitedLiabilityPartnership extends Company {
    type: "LLP";
    numberOfPartners: number;
}

export interface NonProfitOrganization extends Company {
    type: "NPO";
}

export interface ForeignCompany extends Company {
    type: "FXC";
    countryOfOrigin: string;
}
