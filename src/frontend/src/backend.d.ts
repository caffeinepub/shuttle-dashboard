import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Month = bigint;
export interface MonthlyDashboard {
    month: Month;
    revenue: number;
    centerName: string;
    year: bigint;
    target: number;
    coaches: Array<Coach>;
}
export interface Coach {
    center: string;
    name: string;
    salaries: number;
}
export interface backendInterface {
    deleteDashboard(id: bigint): Promise<void>;
    getAllDashboards(): Promise<Array<MonthlyDashboard>>;
    getDashboard(id: bigint): Promise<MonthlyDashboard>;
    getDashboardsByYear(year: bigint): Promise<Array<MonthlyDashboard>>;
    upsertDashboard(id: bigint, dashboard: MonthlyDashboard): Promise<void>;
}
