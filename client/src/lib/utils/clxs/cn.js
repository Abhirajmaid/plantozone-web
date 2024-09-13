import { clsx } from "clsx";

function cn(...args) {
    return clsx(args) ? clsx(args) : "";
}
export default cn;
