import { createContext, useContext } from "react";
import { toast } from "sonner";

export const ToastContext = createContext(null);
export const useToast = () => useContext(ToastContext);
export { toast };
