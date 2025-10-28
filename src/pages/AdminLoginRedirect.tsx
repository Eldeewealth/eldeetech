import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLoginRedirect() {
  const navigate = useNavigate();
  useEffect(() => { navigate('/admin', { replace: true }); }, [navigate]);
  return null;
}

