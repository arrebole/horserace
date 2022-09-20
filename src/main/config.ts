import { Service } from "typedi";

@Service()
export class Configure {
    autoPickChampionId: number = 0;
    autoBanChampionId: number = 0;
    autoAcceptMatch: boolean = true;
}