import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "@/components/AdminNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from "recharts";

type Row = {
  ticket_id: string; name: string; email: string; phone: string;
  subject: string; subject_input?: string; message: string; service_slug: string;
  admin_sent: boolean; customer_sent: boolean; error: string | null;
  created_at: string;
  handled?: boolean; notes?: string | null; handled_at?: string | null; handled_by?: string | null;
};

type Props = { embedded?: boolean };

export default function AdminDashboard({ embedded }: Props) {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [service, setService] = useState("");
  const [serviceOpts, setServiceOpts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [stats, setStats] = useState<any>(null);
  const [selected, setSelected] = useState<Row | null>(null);
  const [notesDraft, setNotesDraft] = useState<string>("");
  const [searchOpts, setSearchOpts] = useState<string[]>([]);
  const [fetchCtrl, setFetchCtrl] = useState<AbortController | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (service) params.set("service", service);
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      params.set("page", String(page));
      params.set("pageSize", String(pageSize));
      const res = await fetch(`/api/admin/submissions?${params.toString()}`);
      if (res.status === 401) { navigate('/admin'); return; }
      const data = await res.json();
      if (res.ok && data?.success) setRows(data.data);
      else setError(data?.message || 'Failed to load');
    } catch (e: any) {
      setError(e?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const params = new URLSearchParams();
      if (from) params.set('from', from);
      if (to) params.set('to', to);
      const res = await fetch(`/api/admin/stats?${params.toString()}`);
      if (res.status === 401) { navigate('/admin'); return; }
      const data = await res.json();
      if (res.ok && data?.success) setStats(data);
    } catch (_) {}
  };

  useEffect(() => {
    (async () => {
      if (!embedded) {
        try {
          const res = await fetch('/api/admin/me');
          if (res.status === 401) { navigate('/admin/login'); return; }
        } catch (_) {
          // ignore
        }
      }
      setChecking(false);
      load();
      loadStats();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [embedded]);

  // Debounced suggestion fetchers for search and service
  useEffect(() => {
    const qv = q.trim();
    if (fetchCtrl) fetchCtrl.abort();
    const ctrl = new AbortController();
    setFetchCtrl(ctrl);
    const t = setTimeout(async () => {
      try {
        if (qv.length >= 2) {
          const r = await fetch(`/api/admin/suggest/search?q=${encodeURIComponent(qv)}`, { signal: ctrl.signal });
          const d = await r.json();
          if (r.ok && d?.success) setSearchOpts(d.options || []);
        } else {
          setSearchOpts([]);
        }
      } catch (_) {}
    }, 200);
    return () => { clearTimeout(t); ctrl.abort(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  useEffect(() => {
    const sv = service.trim();
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/admin/suggest/service?q=${encodeURIComponent(sv)}`, { signal: ctrl.signal });
        const d = await r.json();
        if (r.ok && d?.success) setServiceOpts(d.options || []);
      } catch (_) {}
    }, 200);
    return () => { clearTimeout(t); ctrl.abort(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service]);

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    navigate('/admin');
  };

  const exportCsv = () => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (service) params.set('service', service);
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    window.location.href = `/api/admin/export.csv?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar showLogout onLogout={logout} />
      <section className="pt-32 pb-6">
        <div className="container mx-auto px-4">
          {/* Top actions moved: Logout to navbar; Export is placed with the table */}

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <div>
              <label className="text-xs text-muted-foreground">From</label>
              <Input type="date" value={from} onChange={(e)=>{ setFrom(e.target.value); setPage(1); }} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">To</label>
              <Input type="date" value={to} onChange={(e)=>{ setTo(e.target.value); setPage(1); }} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Search</label>
              <Input list="search-suggest" placeholder="name/email/subject/message" value={q} onChange={(e)=>{ setQ(e.target.value); setPage(1); }} />
              <datalist id="search-suggest">
                {searchOpts.map((opt) => (
                  <option key={opt} value={opt} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Service slug</label>
              <Input list="service-suggest" placeholder="it-consulting" value={service} onChange={(e)=>{ setService(e.target.value); setPage(1); }} />
              <datalist id="service-suggest">
                {serviceOpts.map((opt) => (
                  <option key={opt} value={opt} />
                ))}
              </datalist>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-6">
            <Button onClick={()=>{ load(); loadStats(); }} disabled={loading}>Apply Filters</Button>
            <Button variant="ghost" onClick={()=>{ setFrom(''); setTo(''); setQ(''); setService(''); setPage(1); load(); loadStats(); }}>Reset</Button>
            <div className="ml-auto flex items-center gap-2 text-sm">
              <span>Page size</span>
              <select className="border border-border rounded-md bg-background px-2 py-1" value={pageSize} onChange={(e)=>{ setPageSize(parseInt(e.target.value)); setPage(1); load(); }}>
                <option>10</option>
                <option>20</option>
                <option>50</option>
                <option>100</option>
              </select>
            </div>
          </div>

          {/* Analytics */}
          <Card className="border-border bg-card mb-6">
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              {stats ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg border border-border bg-background">
                      <div className="text-xs text-muted-foreground">Total Submissions</div>
                      <div className="text-2xl font-semibold">{stats.totals?.total ?? 0}</div>
                    </div>
                    <div className="p-4 rounded-lg border border-border bg-background">
                      <div className="text-xs text-muted-foreground">Admin Email Sent</div>
                      <div className="text-2xl font-semibold">{stats.totals?.admin_ok ?? 0}</div>
                    </div>
                    <div className="p-4 rounded-lg border border-border bg-background">
                      <div className="text-xs text-muted-foreground">Customer Email Sent</div>
                      <div className="text-2xl font-semibold">{stats.totals?.customer_ok ?? 0}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats.daily} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorCnt" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="url(#colorCnt)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.byService} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="service_slug" angle={-20} textAnchor="end" interval={0} height={60} tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <Bar dataKey="count" fill="#10b981" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No analytics yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Submissions */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Submissions</CardTitle>
                <Button variant="secondary" onClick={exportCsv}>Export CSV</Button>
              </div>
            </CardHeader>
            <CardContent>
              {error && <p className="text-destructive text-sm mb-2">{error}</p>}
              {checking || loading ? (
                <p>Loading...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b border-border">
                        <th className="py-2 pr-4">Created</th>
                        <th className="py-2 pr-4">Ticket</th>
                        <th className="py-2 pr-4">Name</th>
                        <th className="py-2 pr-4">Email</th>
                        <th className="py-2 pr-4">Service</th>
                        <th className="py-2 pr-4">Subject</th>
                        <th className="py-2 pr-4">Admin</th>
                        <th className="py-2 pr-4">Customer</th>
                        <th className="py-2 pr-4">Handled</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r) => (
                        <tr key={r.ticket_id} className="border-b border-border hover:bg-muted/30 cursor-pointer" onClick={()=>{ setSelected(r); setNotesDraft(r.notes || ''); }}>
                          <td className="py-2 pr-4">{new Date(r.created_at).toLocaleString()}</td>
                          <td className="py-2 pr-4 font-mono text-xs">{r.ticket_id}</td>
                          <td className="py-2 pr-4">{r.name}</td>
                          <td className="py-2 pr-4">{r.email}</td>
                          <td className="py-2 pr-4">{r.service_slug || '-'}</td>
                          <td className="py-2 pr-4">{r.subject}</td>
                          <td className="py-2 pr-4">{r.admin_sent ? 'Yes' : 'No'}</td>
                          <td className="py-2 pr-4">{r.customer_sent ? 'Yes' : 'No'}</td>
                          <td className="py-2 pr-4">{r.handled ? 'Yes' : 'No'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="flex items-center gap-2 justify-end mt-3">
                <Button variant="secondary" onClick={()=>{ setPage(Math.max(1, page-1)); setTimeout(load, 0); }} disabled={page<=1}>Prev</Button>
                <span className="text-sm">Page {page}</span>
                <Button variant="secondary" onClick={()=>{ setPage(page+1); setTimeout(load, 0); }}>Next</Button>
              </div>
          </CardContent>
          </Card>

          {/* Detail modal */}
          {selected && (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={()=>setSelected(null)}>
              <div className="w-full max-w-2xl bg-card border border-border rounded-lg shadow-xl" onClick={(e)=>e.stopPropagation()}>
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Ticket</div>
                    <div className="font-mono text-xs">{selected.ticket_id}</div>
                  </div>
                  <Button variant="ghost" onClick={()=>setSelected(null)}>Close</Button>
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div><div className="text-muted-foreground">Name</div><div>{selected.name}</div></div>
                    <div><div className="text-muted-foreground">Email</div><div>{selected.email}</div></div>
                    <div><div className="text-muted-foreground">Phone</div><div>{selected.phone || '-'}</div></div>
                    <div><div className="text-muted-foreground">Service</div><div>{selected.service_slug || '-'}</div></div>
                    <div><div className="text-muted-foreground">Admin email</div><div>{selected.admin_sent ? 'Yes' : 'No'}</div></div>
                    <div><div className="text-muted-foreground">Customer email</div><div>{selected.customer_sent ? 'Yes' : 'No'}</div></div>
                    <div><div className="text-muted-foreground">Handled</div><div>{selected.handled ? `Yes${selected.handled_at ? ' ('+new Date(selected.handled_at).toLocaleString()+')' : ''}` : 'No'}</div></div>
                    <div><div className="text-muted-foreground">Handled By</div><div>{selected.handled_by || '-'}</div></div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-sm mb-1">Subject</div>
                    <div className="text-sm bg-background border border-border rounded p-2">{selected.subject}</div>
                  </div>
                  {selected.subject_input && selected.subject_input !== selected.subject && (
                    <div>
                      <div className="text-muted-foreground text-sm mb-1">Subject (User Input)</div>
                      <div className="text-sm bg-background border border-border rounded p-2">{selected.subject_input}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-muted-foreground text-sm mb-1">Message</div>
                    <div className="text-sm bg-background border border-border rounded p-2 whitespace-pre-wrap">{selected.message}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-sm mb-1">Notes</div>
                    <textarea className="w-full border border-border rounded bg-background p-2 text-sm" rows={4} value={notesDraft} onChange={(e)=>setNotesDraft(e.target.value)} />
                  </div>
                  <div className="flex items-center gap-2 justify-end pt-2">
                    <Button variant={selected.handled ? 'secondary' : 'default'} onClick={async ()=>{
                      const res = await fetch('/api/admin/update', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ ticket_id: selected.ticket_id, handled: !selected.handled }) });
                      const data = await res.json();
                      if (res.ok && data?.success) {
                        const updated = data.data as Row; setSelected(updated); setRows(prev => prev.map(r => r.ticket_id===updated.ticket_id ? updated : r));
                      }
                    }}>{selected.handled ? 'Mark Unhandled' : 'Mark Handled'}</Button>
                    <Button variant="secondary" onClick={async ()=>{
                      const res = await fetch('/api/admin/update', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ ticket_id: selected.ticket_id, notes: notesDraft }) });
                      const data = await res.json();
                      if (res.ok && data?.success) {
                        const updated = data.data as Row; setSelected(updated); setRows(prev => prev.map(r => r.ticket_id===updated.ticket_id ? updated : r));
                      }
                    }}>Save Notes</Button>
                    <Button variant="ghost" onClick={()=>setSelected(null)}>Close</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
