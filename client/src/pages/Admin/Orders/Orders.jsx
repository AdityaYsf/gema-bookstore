import { useEffect, useState } from 'react'
import { Search, Package, Clock, CheckCircle, XCircle, Truck, Check, BookOpen, CreditCard, Calendar, User, Mail } from 'lucide-react'
import api from "../../../services/api"

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap');

  :root {
    --navy:        #0f1e42;
    --navy-mid:    #1a2f5e;
    --navy-lt:     #253a6e;
    --navy-pale:   #dde4f5;
    --copper:      #d4823a;
    --copper-dk:   #b06828;
    --copper-lt:   #e8a060;
    --copper-pale: #fdecd8;
    --green:       #2d6a4f;
    --green-pale:  #d8f3e8;
    --blue:        #2563eb;
    --blue-pale:   #dbeafe;
    --amber:       #d97706;
    --amber-pale:  #fef3c7;
    --red-pale:    #fff5f5;
    --bg-page:     #f5f7ff;
    --bg-card:     #ffffff;
    --bg-soft:     #eef1fb;
    --bg-mid:      #e4e9f7;
    --border:      rgba(15,30,66,0.1);
    --border-lt:   rgba(15,30,66,0.06);
    --ink2:        #3a4a6e;
    --ink3:        #6272a0;
    --ink4:        #9aa3c2;
  }

  .ao-root {
    font-family: 'Poppins', sans-serif;
    background: var(--bg-page);
    color: var(--navy);
    min-height: 100vh;
    display: flex; flex-direction: column;
  }

  /* ══ HEADER ══ */
  .ao-header {
    background: linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 55%, var(--navy-lt) 100%);
    padding: 2rem clamp(1.5rem, 4vw, 3rem) 1.85rem;
    display: flex; align-items: flex-end;
    justify-content: space-between; gap: 1.5rem;
    flex-wrap: wrap; position: relative; overflow: hidden; flex-shrink: 0;
  }
  .ao-header::before {
    content: 'ORDERS';
    position: absolute; right: clamp(1rem, 4vw, 3rem); bottom: -0.75rem;
    font-size: clamp(3rem, 8vw, 6rem); font-weight: 900;
    color: rgba(255,255,255,0.03); letter-spacing: -0.02em;
    line-height: 1; pointer-events: none; user-select: none;
  }
  .ao-header::after {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse 45% 80% at 85% 50%, rgba(212,130,58,0.12) 0%, transparent 60%);
    pointer-events: none;
  }
  .ao-header-left { position: relative; z-index: 2; }
  .ao-header-eyebrow {
    font-size: 0.66rem; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--copper-lt); margin-bottom: 0.4rem;
    display: flex; align-items: center; gap: 0.6rem;
  }
  .ao-header-eyebrow::before { content:''; display:block; width:1.5rem; height:1px; background:var(--copper-lt); }
  .ao-header-title { font-size: clamp(1.4rem,3vw,2rem); font-weight: 800; color:#fff; line-height:1.1; }
  .ao-header-title em { font-style:italic; color:var(--copper-lt); }

  /* ══ BODY — 3 columns ══ */
  .ao-body {
    display: grid;
    grid-template-columns: 210px 340px 1fr;
    flex: 1; overflow: hidden;
    height: calc(100vh - 118px);
  }
  @media (max-width: 1100px) {
    .ao-body { grid-template-columns: 200px 1fr; }
    .ao-detail { display: none; }
    .ao-body.has-selected .ao-detail { display: flex; }
    .ao-body.has-selected .ao-list-col { display: none; }
  }
  @media (max-width: 700px) {
    .ao-body { grid-template-columns: 1fr; }
    .ao-sidebar { display: none; }
  }

  /* ══ SIDEBAR ══ */
  .ao-sidebar {
    background: var(--bg-card);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    overflow-y: auto; flex-shrink: 0;
  }
  .ao-sidebar-head {
    padding: 1rem 1.1rem 0.65rem;
    font-size: 0.59rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--ink4); border-bottom: 1px solid var(--border-lt); flex-shrink: 0;
  }

  .ao-filter-item {
    display: flex; align-items: center; gap: 0.7rem;
    padding: 0.8rem 1.1rem; cursor: pointer;
    transition: background 0.18s; position: relative;
    border-bottom: 1px solid var(--border-lt);
  }
  .ao-filter-item:last-child { border-bottom: none; }
  .ao-filter-item::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0;
    width: 3px; border-radius: 0 3px 3px 0;
    transition: opacity 0.2s; opacity: 0;
  }
  .ao-filter-item:hover { background: var(--bg-soft); }
  .ao-filter-item.active { background: var(--bg-soft); }
  .ao-filter-item.active::before { opacity: 1; }

  .af-all::before      { background: linear-gradient(180deg, var(--copper), var(--copper-lt)); }
  .af-pending::before  { background: var(--amber); }
  .af-process::before  { background: var(--copper); }
  .af-shipped::before  { background: var(--blue); }
  .af-done::before     { background: var(--green); }
  .af-cancel::before   { background: #dc2626; }

  .ao-filter-icon {
    width: 30px; height: 30px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    transition: transform 0.2s;
  }
  .ao-filter-item.active .ao-filter-icon,
  .ao-filter-item:hover .ao-filter-icon { transform: scale(1.08); }

  .ao-fi-all     { background: var(--copper-pale); color: var(--copper-dk); }
  .ao-fi-pending { background: var(--amber-pale);  color: var(--amber); }
  .ao-fi-process { background: var(--copper-pale); color: var(--copper-dk); }
  .ao-fi-shipped { background: var(--blue-pale);   color: var(--blue); }
  .ao-fi-done    { background: var(--green-pale);  color: var(--green); }
  .ao-fi-cancel  { background: var(--red-pale);    color: #dc2626; }

  .ao-filter-label { font-size: 0.78rem; font-weight: 600; color: var(--navy); flex: 1; }
  .ao-filter-count {
    font-size: 0.6rem; font-weight: 700;
    background: var(--bg-mid); color: var(--ink3);
    padding: 0.1rem 0.48rem; border-radius: 100px; flex-shrink: 0;
  }
  .ao-filter-item.active .ao-filter-count { background: var(--copper-pale); color: var(--copper-dk); }

  /* ══ LIST COLUMN ══ */
  .ao-list-col {
    display: flex; flex-direction: column;
    border-right: 1px solid var(--border);
    overflow: hidden; background: var(--bg-card);
  }

  .ao-list-toolbar {
    padding: 0.8rem 0.9rem;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0; background: var(--bg-card);
  }
  .ao-search-wrap { position: relative; }
  .ao-search-icon {
    position: absolute; left: 0.8rem; top:50%; transform:translateY(-50%);
    color: var(--ink4); pointer-events: none; transition: color 0.2s;
  }
  .ao-search-wrap:focus-within .ao-search-icon { color: var(--copper); }
  .ao-search-input {
    width: 100%; background: var(--bg-soft);
    border: 1.5px solid var(--border); color: var(--navy);
    font-family: 'Poppins', sans-serif; font-size: 0.8rem;
    padding: 0.58rem 0.9rem 0.58rem 2.4rem;
    border-radius: 9px; outline: none; transition: all 0.2s;
    box-sizing: border-box;
  }
  .ao-search-input::placeholder { color: var(--ink4); }
  .ao-search-input:focus {
    background: var(--bg-card); border-color: var(--copper);
    box-shadow: 0 0 0 3px rgba(212,130,58,0.1);
  }

  .ao-list-scroll { flex: 1; overflow-y: auto; }
  .ao-list-count {
    padding: 0.5rem 0.9rem;
    font-size: 0.62rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--ink4); background: var(--bg-soft);
    border-bottom: 1px solid var(--border-lt);
    position: sticky; top: 0; z-index: 2;
  }

  /* Order row in list */
  .ao-order-row {
    padding: 0.85rem 0.9rem;
    border-bottom: 1px solid var(--border-lt);
    cursor: pointer; transition: background 0.15s;
    position: relative;
  }
  .ao-order-row::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0;
    width: 3px; opacity: 0; transition: opacity 0.2s;
    background: linear-gradient(180deg, var(--copper), var(--copper-lt));
  }
  .ao-order-row:hover { background: var(--bg-soft); }
  .ao-order-row.selected { background: var(--bg-soft); }
  .ao-order-row.selected::before { opacity: 1; }
  .ao-order-row:last-child { border-bottom: none; }

  .ao-row-top {
    display: flex; align-items: center; justify-content: space-between;
    gap: 0.5rem; margin-bottom: 0.28rem;
  }
  .ao-row-id    { font-size: 0.78rem; font-weight: 800; color: var(--navy); }
  .ao-row-total { font-size: 0.8rem; font-weight: 800; color: var(--navy); }
  .ao-row-customer {
    font-size: 0.74rem; font-weight: 600; color: var(--ink2);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    margin-bottom: 0.28rem;
  }
  .ao-row-bot {
    display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;
  }
  .ao-row-date  { font-size: 0.65rem; color: var(--ink4); }

  /* Skeleton */
  .ao-skel { padding: 0.85rem 0.9rem; border-bottom: 1px solid var(--border-lt); display:flex; flex-direction:column; gap:0.38rem; }
  .ao-skel-bar {
    background: var(--bg-mid); border-radius: 5px;
    position: relative; overflow: hidden;
  }
  .ao-skel-bar::after {
    content:''; position:absolute; inset:0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
    animation: shimmer 1.4s infinite;
  }
  @keyframes shimmer { from{transform:translateX(-100%)} to{transform:translateX(100%)} }

  /* Empty list */
  .ao-list-empty {
    padding: 3rem 1rem; text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 0.55rem;
  }
  .ao-list-empty-icon {
    width: 42px; height: 42px; background: var(--bg-soft);
    border: 1px solid var(--border); border-radius: 10px;
    display: flex; align-items: center; justify-content: center; color: var(--ink4);
  }
  .ao-list-empty-title { font-size: 0.82rem; font-weight: 700; color: var(--ink2); }
  .ao-list-empty-desc  { font-size: 0.7rem; color: var(--ink4); }

  /* ══ STATUS BADGE ══ */
  .ao-badge {
    display: inline-flex; align-items: center; gap: 0.26rem;
    font-size: 0.58rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
    padding: 0.16rem 0.5rem; border-radius: 100px; white-space: nowrap;
  }
  .ao-badge-dot { width: 4px; height: 4px; border-radius: 50%; background: currentColor; }
  .ab-PENDING    { background: var(--amber-pale);  color: var(--amber); }
  .ab-PROCESSING { background: var(--copper-pale); color: var(--copper-dk); }
  .ab-SHIPPED    { background: var(--blue-pale);   color: var(--blue); }
  .ab-DELIVERED  { background: var(--green-pale);  color: var(--green); }
  .ab-CANCELLED  { background: var(--red-pale);    color: #dc2626; }
  .ab-PAID       { background: var(--green-pale);  color: var(--green); }
  .ab-UNPAID     { background: var(--amber-pale);  color: var(--amber); }
  .ab-FAILED     { background: var(--red-pale);    color: #dc2626; }

  /* ══ DETAIL PANEL ══ */
  .ao-detail {
    display: flex; flex-direction: column;
    overflow: hidden; background: var(--bg-page);
  }

  .ao-detail-empty {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 0.75rem;
    padding: 2rem; text-align: center;
  }
  .ao-detail-empty-icon {
    width: 54px; height: 54px;
    background: linear-gradient(135deg, var(--navy), var(--navy-mid));
    border-radius: 14px; display: flex; align-items: center; justify-content: center;
    color: rgba(255,255,255,0.35); margin-bottom: 0.25rem;
    box-shadow: 0 4px 16px rgba(15,30,66,0.15);
  }
  .ao-detail-empty-title { font-size: 0.9rem; font-weight: 700; color: var(--ink2); }
  .ao-detail-empty-desc  { font-size: 0.75rem; color: var(--ink4); max-width: 22ch; line-height: 1.65; }

  /* Detail head */
  .ao-detail-head {
    background: var(--bg-card); border-bottom: 1px solid var(--border);
    padding: 1rem 1.3rem;
    display: flex; align-items: center; justify-content: space-between;
    gap: 1rem; flex-wrap: wrap; flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(15,30,66,0.05);
  }
  .ao-detail-head-id   { font-size: 0.95rem; font-weight: 800; color: var(--navy); }
  .ao-detail-head-date { font-size: 0.68rem; color: var(--ink4); margin-top: 0.1rem; }
  .ao-detail-head-right { display: flex; gap: 0.4rem; flex-wrap: wrap; align-items: center; }

  /* Detail scroll */
  .ao-detail-scroll {
    flex: 1; overflow-y: auto;
    padding: 1.2rem 1.3rem;
    display: flex; flex-direction: column; gap: 1.1rem;
  }

  /* Section label */
  .ao-section-label {
    font-size: 0.61rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--copper-dk); margin-bottom: 0.65rem;
    display: flex; align-items: center; gap: 0.55rem;
  }
  .ao-section-label::after { content:''; flex:1; height:1px; background:var(--border); }

  /* Info cards grid */
  .ao-info-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 0.55rem;
  }
  .ao-info-card {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 9px; padding: 0.8rem 0.95rem;
    display: flex; align-items: center; gap: 0.7rem;
  }
  .ao-info-icon {
    width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .ao-ii-user  { background: var(--navy-pale); color: var(--navy); }
  .ao-ii-mail  { background: var(--blue-pale);   color: var(--blue); }
  .ao-ii-pay   { background: var(--copper-pale); color: var(--copper-dk); }
  .ao-ii-date  { background: var(--green-pale);  color: var(--green); }
  .ao-info-lbl { font-size: 0.58rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink4); margin-bottom: 0.18rem; }
  .ao-info-val { font-size: 0.8rem; font-weight: 700; color: var(--navy); line-height: 1.3; }

  /* Items */
  .ao-items-card {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 10px; overflow: hidden;
  }
  .ao-item-row {
    display: flex; align-items: center; gap: 0.8rem;
    padding: 0.75rem 0.95rem; border-bottom: 1px solid var(--border-lt);
  }
  .ao-item-row:last-child { border-bottom: none; }
  .ao-item-cover {
    width: 32px; height: 44px; object-fit: cover;
    border-radius: 4px; flex-shrink: 0; box-shadow: 0 2px 6px rgba(15,30,66,0.15);
  }
  .ao-item-cover-ph {
    width: 32px; height: 44px; background: var(--bg-soft); border: 1px solid var(--border);
    border-radius: 4px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; color: var(--ink4);
  }
  .ao-item-title  { font-size: 0.8rem; font-weight: 700; color: var(--navy); line-height: 1.3; }
  .ao-item-author { font-size: 0.66rem; color: var(--ink3); margin-top: 0.08rem; }
  .ao-item-right  { margin-left: auto; text-align: right; flex-shrink: 0; }
  .ao-item-pval   { font-size: 0.82rem; font-weight: 800; color: var(--navy); }
  .ao-item-qty    { font-size: 0.63rem; color: var(--ink4); }

  /* Total strip */
  .ao-total-strip {
    background: linear-gradient(135deg, var(--navy), var(--navy-mid));
    border-radius: 10px; padding: 0.85rem 1.1rem;
    display: flex; align-items: center; justify-content: space-between;
    position: relative; overflow: hidden;
  }
  .ao-total-strip::after {
    content:''; position:absolute; inset:0;
    background: radial-gradient(ellipse 60% 80% at 90% 50%, rgba(212,130,58,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .ao-total-lbl { font-size: 0.66rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(200,215,255,0.45); }
  .ao-total-val { font-size: 1.05rem; font-weight: 800; color: var(--copper-lt); position: relative; z-index: 1; }

  /* Status update */
  .ao-status-box {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 10px; padding: 0.9rem 1rem;
  }
  .ao-status-row { display: flex; align-items: center; gap: 0.7rem; flex-wrap: wrap; }
  .ao-status-select {
    flex: 1; min-width: 120px;
    background: var(--bg-soft); border: 1.5px solid var(--border);
    color: var(--navy); font-family: 'Poppins', sans-serif;
    font-size: 0.82rem; font-weight: 600;
    padding: 0.58rem 0.8rem; border-radius: 8px; outline: none;
    transition: all 0.2s; cursor: pointer;
  }
  .ao-status-select:focus {
    border-color: var(--copper); background: var(--bg-card);
    box-shadow: 0 0 0 3px rgba(212,130,58,0.1);
  }
  .ao-save-btn {
    display: inline-flex; align-items: center; gap: 0.38rem;
    background: linear-gradient(135deg, var(--navy), var(--navy-mid));
    color: #fff; font-family: 'Poppins', sans-serif;
    font-size: 0.76rem; font-weight: 700;
    border: none; cursor: pointer; padding: 0.58rem 1.05rem;
    border-radius: 8px; transition: all 0.25s; flex-shrink: 0;
    box-shadow: 0 3px 10px rgba(15,30,66,0.18);
    position: relative; overflow: hidden;
  }
  .ao-save-btn::before {
    content:''; position:absolute; inset:0;
    background: linear-gradient(135deg, var(--copper), var(--copper-dk));
    opacity: 0; transition: opacity 0.25s;
  }
  .ao-save-btn:hover:not(:disabled)::before { opacity: 1; }
  .ao-save-btn:hover:not(:disabled) { box-shadow: 0 5px 14px rgba(212,130,58,0.4); transform: translateY(-1px); }
  .ao-save-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .ao-save-btn > * { position: relative; z-index: 1; }
`

const formatPrice = (n) =>
  new Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', minimumFractionDigits:0 }).format(n)

const formatDate = (d) =>
  new Date(d).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })

const STATUS_LIST  = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']
const STATUS_LABEL = { PENDING:'Menunggu', PROCESSING:'Diproses', SHIPPED:'Dikirim', DELIVERED:'Selesai', CANCELLED:'Dibatalkan' }
const STATUS_ICON  = { PENDING:Clock, PROCESSING:Package, SHIPPED:Truck, DELIVERED:CheckCircle, CANCELLED:XCircle }

const FILTERS = [
  { key:'ALL',        label:'Semua',    iconCls:'ao-fi-all',     cls:'af-all',     Icon:Package },
  { key:'PENDING',    label:'Menunggu', iconCls:'ao-fi-pending', cls:'af-pending', Icon:Clock },
  { key:'PROCESSING', label:'Diproses', iconCls:'ao-fi-process', cls:'af-process', Icon:Package },
  { key:'SHIPPED',    label:'Dikirim',  iconCls:'ao-fi-shipped', cls:'af-shipped', Icon:Truck },
  { key:'DELIVERED',  label:'Selesai',  iconCls:'ao-fi-done',    cls:'af-done',    Icon:CheckCircle },
  { key:'CANCELLED',  label:'Batal',    iconCls:'ao-fi-cancel',  cls:'af-cancel',  Icon:XCircle },
]

const AdminOrders = () => {
  const [orders, setOrders]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [filter, setFilter]       = useState('ALL')
  const [selected, setSelected]   = useState(null)
  const [newStatus, setNewStatus] = useState('')
  const [saving, setSaving]       = useState(false)

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/admin/orders')
      setOrders(data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleSave = async () => {
    if (!newStatus || newStatus === selected.status) return
    try {
      setSaving(true)
      await api.put(`/admin/orders/${selected.id}`, { status: newStatus })
      await fetchOrders()
      setSelected(prev => ({ ...prev, status: newStatus }))
    } catch { alert('Gagal memperbarui status') }
    finally { setSaving(false) }
  }

  const selectOrder = (order) => { setSelected(order); setNewStatus(order.status) }

  const counts = orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc }, {})

  const filtered = orders.filter(o => {
    const matchStatus = filter === 'ALL' || o.status === filter
    const q = search.toLowerCase()
    const matchSearch = !q
      || o.id?.toString().includes(q)
      || o.user?.name?.toLowerCase().includes(q)
      || o.user?.email?.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  return (
    <div className="ao-root">
      <style>{styles}</style>

      {/* HEADER */}
      <div className="ao-header">
        <div className="ao-header-left">
          <div className="ao-header-eyebrow">Panel Admin</div>
          <h1 className="ao-header-title">Kelola <em>Pesanan</em></h1>
        </div>
      </div>

      {/* BODY */}
      <div className={`ao-body ${selected ? 'has-selected' : ''}`}>

        {/* ── SIDEBAR ── */}
        <aside className="ao-sidebar">
          <div className="ao-sidebar-head">Filter Status</div>
          {FILTERS.map(({ key, label, iconCls, cls, Icon }) => (
            <div
              key={key}
              className={`ao-filter-item ${cls} ${filter === key ? 'active' : ''}`}
              onClick={() => setFilter(key)}
            >
              <div className={`ao-filter-icon ${iconCls}`}><Icon size={14}/></div>
              <span className="ao-filter-label">{label}</span>
              <span className="ao-filter-count">{key === 'ALL' ? orders.length : (counts[key] || 0)}</span>
            </div>
          ))}
        </aside>

        {/* ── LIST ── */}
        <div className="ao-list-col">
          <div className="ao-list-toolbar">
            <div className="ao-search-wrap">
              <Search size={13} className="ao-search-icon"/>
              <input
                type="text" placeholder="Cari nama, email, ID..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="ao-search-input"
              />
            </div>
          </div>

          <div className="ao-list-scroll">
            <div className="ao-list-count">{filtered.length} pesanan</div>

            {loading ? (
              [...Array(8)].map((_, i) => (
                <div key={i} className="ao-skel">
                  <div style={{display:'flex',justifyContent:'space-between',gap:'0.5rem'}}>
                    <div className="ao-skel-bar" style={{width:'38%',height:11}}/>
                    <div className="ao-skel-bar" style={{width:'28%',height:11}}/>
                  </div>
                  <div className="ao-skel-bar" style={{width:'58%',height:10}}/>
                  <div style={{display:'flex',justifyContent:'space-between',gap:'0.5rem'}}>
                    <div className="ao-skel-bar" style={{width:'32%',height:9}}/>
                    <div className="ao-skel-bar" style={{width:'24%',height:9}}/>
                  </div>
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div className="ao-list-empty">
                <div className="ao-list-empty-icon"><Package size={18}/></div>
                <div className="ao-list-empty-title">Tidak Ada Pesanan</div>
                <div className="ao-list-empty-desc">
                  {search ? `Tidak ada hasil untuk "${search}"` : 'Belum ada pesanan di kategori ini'}
                </div>
              </div>
            ) : filtered.map(order => (
              <div
                key={order.id}
                className={`ao-order-row ${selected?.id === order.id ? 'selected' : ''}`}
                onClick={() => selectOrder(order)}
              >
                <div className="ao-row-top">
                  <span className="ao-row-id">#{order.id?.toString().padStart(5,'0')}</span>
                  <span className="ao-row-total">{formatPrice(order.totalAmount || 0)}</span>
                </div>
                <div className="ao-row-customer">{order.user?.name || '—'}</div>
                <div className="ao-row-bot">
                  <span className="ao-row-date">{formatDate(order.createdAt)}</span>
                  <span className={`ao-badge ab-${order.status}`}>
                    <span className="ao-badge-dot"/>
                    {STATUS_LABEL[order.status] || order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── DETAIL PANEL ── */}
        <div className="ao-detail">
          {!selected ? (
            <div className="ao-detail-empty">
              <div className="ao-detail-empty-icon"><Package size={22}/></div>
              <div className="ao-detail-empty-title">Pilih Pesanan</div>
              <div className="ao-detail-empty-desc">Klik salah satu pesanan di sebelah kiri untuk melihat detailnya</div>
            </div>
          ) : (
            <>
              {/* Detail head */}
              <div className="ao-detail-head">
                <div>
                  <div className="ao-detail-head-id">Pesanan #{selected.id?.toString().padStart(5,'0')}</div>
                  <div className="ao-detail-head-date">{formatDate(selected.createdAt)}</div>
                </div>
                <div className="ao-detail-head-right">
                  <span className={`ao-badge ab-${selected.status}`}>
                    <span className="ao-badge-dot"/>
                    {STATUS_LABEL[selected.status]}
                  </span>
                  <span className={`ao-badge ab-${selected.paymentStatus || 'UNPAID'}`}>
                    <span className="ao-badge-dot"/>
                    {selected.paymentStatus === 'PAID' ? 'Lunas' : selected.paymentStatus === 'FAILED' ? 'Gagal' : 'Belum Bayar'}
                  </span>
                </div>
              </div>

              {/* Detail content */}
              <div className="ao-detail-scroll">

                {/* Customer info */}
                <div>
                  <div className="ao-section-label">Informasi Pelanggan</div>
                  <div className="ao-info-grid">
                    {[
                      { icon:<User size={13}/>, cls:'ao-ii-user', label:'Pelanggan', val: selected.user?.name || '—' },
                      { icon:<Mail size={13}/>, cls:'ao-ii-mail', label:'Email', val: selected.user?.email || '—' },
                      { icon:<CreditCard size={13}/>, cls:'ao-ii-pay', label:'Metode Bayar', val: selected.paymentMethod ? selected.paymentMethod.replace(/_/g,' ').toUpperCase() : '—' },
                      { icon:<Calendar size={13}/>, cls:'ao-ii-date', label:'Tgl Bayar', val: selected.paidAt ? formatDate(selected.paidAt) : '—' },
                    ].map(({ icon, cls, label, val }) => (
                      <div key={label} className="ao-info-card">
                        <div className={`ao-info-icon ${cls}`}>{icon}</div>
                        <div>
                          <div className="ao-info-lbl">{label}</div>
                          <div className="ao-info-val" style={{fontSize: label === 'Email' ? '0.72rem' : undefined}}>{val}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Items */}
                <div>
                  <div className="ao-section-label">Item Pesanan</div>
                  <div className="ao-items-card">
                    {(selected.items || []).map((item, i) => (
                      <div key={i} className="ao-item-row">
                        {item.book?.coverImage
                          ? <img src={item.book.coverImage} alt={item.book.title} className="ao-item-cover"/>
                          : <div className="ao-item-cover-ph"><BookOpen size={11}/></div>
                        }
                        <div style={{flex:1, minWidth:0}}>
                          <div className="ao-item-title">{item.book?.title || 'Buku'}</div>
                          <div className="ao-item-author">{item.book?.author || '—'}</div>
                        </div>
                        <div className="ao-item-right">
                          <div className="ao-item-pval">{formatPrice(item.price || 0)}</div>
                          <div className="ao-item-qty">×{item.quantity}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="ao-total-strip">
                  <div className="ao-total-lbl">Total Pembayaran</div>
                  <div className="ao-total-val">{formatPrice(selected.totalAmount || 0)}</div>
                </div>

                {/* Status update */}
                <div>
                  <div className="ao-section-label">Perbarui Status</div>
                  <div className="ao-status-box">
                    <div className="ao-status-row">
                      <select
                        value={newStatus}
                        onChange={e => setNewStatus(e.target.value)}
                        className="ao-status-select"
                      >
                        {STATUS_LIST.map(s => (
                          <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                        ))}
                      </select>
                      <button
                        className="ao-save-btn"
                        onClick={handleSave}
                        disabled={saving || newStatus === selected.status}
                      >
                        <Check size={12}/>
                        {saving ? 'Menyimpan...' : 'Simpan'}
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </>
          )}
        </div>

      </div>
    </div>
  )
}

export default AdminOrders