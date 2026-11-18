import { useCallback } from "react";
import { toast } from "sonner";
import { ToastContext } from "./toastValue";
import { Toaster } from "../components/ui/sonner";

export function ToastProvider({ children }) {
  const showToast = useCallback((message, type = "info") => {
    switch (type) {
      case "success":
        return toast.success(message);
      case "error":
        return toast.error(message);
      case "warning":
        return toast.warning(message);
      case "loading":
        return toast.loading(message);
      default:
        return toast.info(message);
    }
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, toast }}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  );
}
