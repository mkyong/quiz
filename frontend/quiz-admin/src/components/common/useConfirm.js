import { useCallback, useState } from "react";

export function useConfirm() {
  const [state, setState] = useState({
    open: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    danger: false,
    resolve: null,
  });

  const confirm = useCallback((opts) => {
    return new Promise((resolve) => {
      setState((s) => ({
        ...s,
        open: true,
        title: opts?.title ?? "Confirm",
        message: opts?.message ?? "Are you sure?",
        confirmText: opts?.confirmText ?? "Confirm",
        cancelText: opts?.cancelText ?? "Cancel",
        danger: !!opts?.danger,
        resolve,
      }));
    });
  }, []);

  const close = useCallback((result) => {
    state.resolve?.(result);
    setState((s) => ({ ...s, open: false, resolve: null }));
  }, [state.resolve]);

  return { state, confirm, close };
}
