import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeToast } from "../store/toastSlice";

function Toast({ toast }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => dispatch(removeToast(toast.id)), 4500);
    return () => clearTimeout(timer);
  }, [toast.id, dispatch]);

  return (
    <div className={`toast ${toast.type}`} onClick={() => dispatch(removeToast(toast.id))}>
      {toast.message}
    </div>
  );
}

export default function Toaster() {
  const items = useSelector((state) => state.toast.items);

  return (
    <div className="toaster">
      {items.map((t) => (
        <Toast key={t.id} toast={t} />
      ))}
    </div>
  );
}