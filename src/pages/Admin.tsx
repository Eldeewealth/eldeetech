import { useEffect, useState } from "react";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

export default function Admin() {
  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/me');
        setAuthed(res.ok);
      } catch (_) {
        setAuthed(false);
      } finally {
        setChecked(true);
      }
    })();
  }, []);

  if (!checked) return null;

  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />;

  return <AdminDashboard embedded />;
}

