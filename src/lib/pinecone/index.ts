import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";

dotenv.config();

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_KEY!,
});

export const pc = pinecone.Index(process.env.PINECONE_INDEX!);
