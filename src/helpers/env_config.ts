import { error } from "console";
import path from "path";
import dotenv from "dotenv"; 

export default function getEnvConfig(): void {
    try {
        const filePath = path.resolve(
            __dirname,
            "..",
            "..",
            `.env.${process.env.NODE_ENV}`
        );

        dotenv.config({ path: filePath });
    } catch (_error) {
        if (typeof _error === "string") {
            error("Error loading environment variables:", _error);
        } else if (_error instanceof Error) {
            error("Error loading environment variables:", _error.message);
        }
    }
}
