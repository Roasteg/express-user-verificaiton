import { register } from "tsconfig-paths";
import { compilerOptions } from "./tsconfig.json";

const baseUrl = "./";
const { paths } = compilerOptions;

register({
    baseUrl,
    paths,
});
