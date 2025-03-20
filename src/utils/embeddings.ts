import { NomicEmbeddings } from "@langchain/nomic";
import dotenv from "dotenv";

dotenv.config();

const nomicEmbeddings = new NomicEmbeddings({
  apiKey: process.env.NOMIC_API_KEY!,
  modelName: "nomic-embed-text-v1",
});

export async function generateEmbedding(text: string): Promise<number[]> {
  return await nomicEmbeddings.embedQuery(text);
}
