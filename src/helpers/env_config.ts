import path from "path";
import dotenv from "dotenv";
export default function getEnvConfig() {
    try {
        const filePath = path.resolve(
            __dirname,
            "..",
            "..",
            `.env.${process.env.NODE_ENV}`
        );
        dotenv.config({ path: filePath });
    } catch (error) {
        console.error("Error loading environment variables:", error.message);
    }
}
