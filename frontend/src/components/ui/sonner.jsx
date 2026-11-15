import { Toaster as Sonner } from "sonner";

export function Toaster({ ...props }) {
  return (
    <Sonner
      className="toaster group"
      position="bottom-right"
      richColors
      closeButton
      style={{
        fontFamily: "var(--font-sans)",
      }}
      toastOptions={{
        style: {
          borderRadius: "12px",
          padding: "12px 16px",
          fontSize: "13.5px",
          fontWeight: 500,
          boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.4)",
        },
      }}
      {...props}
    />
  );
}

export default Toaster;
