import dotenv from "dotenv";

dotenv.config();

export const NODO_DAZLABS = process.env.NODO_DAZLABS;
export const PRIVATE_KEY_ACCOUNT0 = process.env.PRIVATE_KEY_ACCOUNT0 || "1";
export const CHAIN_ID = Number(process.env.CHAIN_ID);
