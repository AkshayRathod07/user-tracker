import { toast as toastify } from "react-toastify";

export function useToast() {
  return {
    toast: ({ title, description, variant }: { title: string; description: string; variant?: string }) => {
      toastify(`${title}\n${description}`, {
        type: variant === "destructive" ? "error" : "default",
        position: "top-right",
        autoClose: 5000,
      });
    },
  };
}
