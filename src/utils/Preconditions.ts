import { IndroError } from "./IndroError";

export const Precondition = {
    checkIfTrue: async (boo: boolean, msg: string, conn = null, status = 500) => {
        if (!boo) {
            conn && await conn.release();
            throw new IndroError(msg, status);
        }
        return;
    },
    checkIfFalse: async (boo: boolean, msg: string, conn = null, status = 500) => {
        if (boo) {
            conn && await conn.release();
            throw new IndroError(msg, status);
        }
        return;
    },
}