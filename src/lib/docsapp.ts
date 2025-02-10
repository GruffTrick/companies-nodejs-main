// import axios from "axios"; // this is the same as: import {default as axios} from "axios";
import {default as axios, AxiosRequestConfig} from "axios";

import * as model from "./docsapp-model";
import {Company} from "./docsapp-model";
import process from "node:process";

let baseUrl = process.env.TARGET_URL || "http://localhost/companies";

let config: AxiosRequestConfig<model.Company> = {
    baseURL: baseUrl
}

function validate(company: Company) {
    if (!company.type || !company.companyName || !company.registrationNumber) {
        throw Error("Invalid company");
    }
}

function isCompanyNumberValid(companyNumber: number) {
    return (companyNumber >= 100000000 && companyNumber <= 999999999);
}

export function getCompanies() {
    return axios.get<model.Company[]>("", config)
        .then(response => {
            let companies: model.Company[] = response.data;
            for (let company of companies) {
                validate(company);
            }
            return companies;
        })
        .catch(error => {
            console.error(error.message)
            throw error;
        });
}

export function getCompany(companyNumber: number) {
    if (!isCompanyNumberValid(companyNumber)) {
        return Promise.reject(new Error("Invalid company number"));
    }
    return axios.get<model.Company>(`/${companyNumber}`, config)
        .then(response => {
            let company: model.Company = response.data;
            validate(company);
            return company;
        })
        .catch(error => {
            console.error(error.message)
            throw error;
        });
}

export function setupCompany(company: model.Company) {
    company.registrationNumber = undefined;
    return axios.post<model.Company>("", company, config)
        .then(response => {
            let company: model.Company = response.data;
            validate(company);
            return company;
        })
        .catch(error => {
            console.error(error.message)
            throw error;
        });
}

export function modifyCompany(companyNumber: number, company: model.Company) {
    if (!isCompanyNumberValid(companyNumber)) {
        return Promise.reject(new Error("Invalid company number"));
    }
    return axios.put<model.Company>(`/${companyNumber}`, company, config)
        .then(response => {
            let company: model.Company = response.data;
            validate(company);
            return company;
        })
        .catch(error => {
            console.error(error.message)
            throw error;
        });
}

export function patchCompany(companyNumber: number, company: model.Company) {
    if (!isCompanyNumberValid(companyNumber)) {
        return Promise.reject(new Error("Invalid company number"));
    }
    return axios.put<model.Company>(`/${companyNumber}`, company, config)
        .then(response => {
            let company: model.Company = response.data;
            validate(company);
            return company;
        })
        .catch(error => {
            console.error(error.message)
            throw error;
        });
}

export function strikeOffCompany(companyNumber: number) {
    if (!isCompanyNumberValid(companyNumber)) {
        return Promise.reject(new Error("Invalid company number"));
    }
    return axios.delete<model.Company>(`/${companyNumber}`, config)
        .then(response => {

        })
        .catch(error => {
            console.error(error.message)
            throw error;
        });
}
