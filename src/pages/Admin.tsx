import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

export default function Admin() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);
  const idleMs = (Number((import.meta as any).env?.VITE_ADMIN_IDLE_MINUTES) || 15) * 60 * 1000; // default 15 minutes
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleLogout = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(async () => {
      try { await fetch('/api/admin/logout', { method: 'POST' }); } catch (_) {}
      setAuthed(false);
      navigate('/admin', { replace: true });
    }, idleMs);
  };

  const resetIdle = () => {
    if (!authed) return;
    scheduleLogout();
  };

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

  useEffect(() => {
    if (authed) {
      scheduleLogout();
      const events: (keyof DocumentEventMap)[] = ['mousemove','keydown','scroll','click','touchstart','visibilitychange'];
      events.forEach((ev) => document.addEventListener(ev, resetIdle, { passive: true } as any));
      return () => {
        events.forEach((ev) => document.removeEventListener(ev, resetIdle as any));
        if (idleTimer.current) clearTimeout(idleTimer.current);
      };
    }
    return;
  }, [authed]);

  // Force logout when navigating away from /admin (component unmount)
  useEffect(() => {
    return () => {
      // Best-effort logout to clear session cookie
      fetch('/api/admin/logout', { method: 'POST' }).finally(() => {
        setAuthed(false);
      });
    };
  }, []);

  if (!checked) return null;

  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />;

  return <AdminDashboard embedded />;
}
