import { Repository } from "../Repository";
import { Card } from "../../models/financial/Card";
import { Transaction } from "../../models/financial/Transaction";

export class TransactionRepository extends Repository<Transaction> {
    public table = "transactions";

}
