import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen, Clock, CheckCircle, XCircle, AlertCircle,
  ArrowLeft, ShoppingBag, RefreshCw, CreditCard,
  Package, Truck, MapPin, ChevronDown
} from 'lucide-react'
import api from '../../services/api'

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

  .mo-root {
    font-family: 'Poppins', sans-serif;
    background: var(--bg-page);
    color: var(--navy);
    min-height: 100vh;
  }

  /* ══ HEADER ══ */
  .mo-header {
    background: linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 55%, var(--navy-lt) 100%);
    padding: 2.5rem clamp(1.5rem, 5vw, 4rem) 2.25rem;
    position: relative; overflow: hidden;
    display: flex; align-items: flex-end;
    justify-content: space-between; gap: 1.5rem; flex-wrap: wrap;
  }
  .mo-header::before {
    content: 'ORDERS';
    position: absolute; right: clamp(1rem,4vw,3rem); bottom: -0.75rem;
    font-size: clamp(3rem,8vw,6.5rem); font-weight: 900;
    color: rgba(255,255,255,0.03); letter-spacing: -0.02em;
    line-height: 1; pointer-events: none; user-select: none;
  }
  .mo-header::after {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse 45% 80% at 85% 50%, rgba(212,130,58,0.1) 0%, transparent 60%);
    pointer-events: none;
  }
  .mo-header-left { position: relative; z-index: 2; }
  .mo-header-eyebrow {
    font-size: 0.67rem; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--copper-lt); margin-bottom: 0.5rem;
    display: flex; align-items: center; gap: 0.6rem;
  }
  .mo-header-eyebrow::before { content:''; display:block; width:1.5rem; height:1px; background:var(--copper-lt); }
  .mo-header-title { font-size: clamp(1.6rem,4vw,2.4rem); font-weight: 800; color: #fff; line-height: 1.1; }
  .mo-header-title em { font-style: italic; color: var(--copper-lt); }
  .mo-back-btn {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
    color: rgba(255,255,255,0.85);
    font-family: 'Poppins', sans-serif; font-size: 0.82rem; font-weight: 600;
    text-decoration: none; padding: 0.65rem 1.25rem; border-radius: 9px;
    transition: all 0.22s; white-space: nowrap; flex-shrink: 0;
    position: relative; z-index: 2; backdrop-filter: blur(8px);
  }
  .mo-back-btn:hover { background: rgba(255,255,255,0.18); }

  /* ══ TABS ══ */
  .mo-tabs {
    background: var(--bg-card); border-bottom: 1px solid var(--border);
    padding: 0 clamp(1.5rem, 5vw, 4rem);
    display: flex; overflow-x: auto;
    box-shadow: 0 2px 8px rgba(15,30,66,0.05);
    position: sticky; top: 66px; z-index: 89;
  }
  .mo-tab {
    padding: 0.9rem 1.2rem;
    font-size: 0.78rem; font-weight: 600; color: var(--ink4);
    cursor: pointer; border: none; background: none;
    font-family: 'Poppins', sans-serif;
    display: flex; align-items: center; gap: 0.45rem;
    white-space: nowrap; border-bottom: 2px solid transparent;
    transition: all 0.2s; position: relative; top: 1px;
  }
  .mo-tab:hover { color: var(--ink2); }
  .mo-tab.active { color: var(--navy); border-bottom-color: var(--copper); }
  .mo-tab-count {
    font-size: 0.6rem; font-weight: 700;
    padding: 0.1rem 0.48rem; border-radius: 100px;
    background: var(--bg-soft); color: var(--ink4);
  }
  .mo-tab.active .mo-tab-count { background: var(--copper-pale); color: var(--copper-dk); }

  /* ══ MAIN ══ */
  .mo-main {
    max-width: 780px; margin: 0 auto;
    padding: 2.5rem clamp(1.5rem, 5vw, 4rem);
  }

  /* ══ TIMELINE ══ */
  .mo-timeline { position: relative; }
  .mo-timeline::before {
    content: '';
    position: absolute; left: 19px; top: 0; bottom: 0; width: 2px;
    background: linear-gradient(180deg, var(--copper) 0%, var(--navy-pale) 35%, var(--bg-mid) 100%);
    border-radius: 2px;
  }

  /* ── Timeline Item ── */
  .mo-tl-item {
    display: flex; gap: 1.25rem;
    margin-bottom: 2rem; position: relative;
    animation: fadeUp 0.35s ease both;
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(12px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* Dot */
  .mo-tl-dot {
    width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    position: relative; z-index: 2; margin-top: 0.2rem;
    border: 3px solid var(--bg-page);
    transition: transform 0.25s; cursor: pointer;
  }
  .mo-tl-item:hover .mo-tl-dot { transform: scale(1.1); }

  .mo-dot-pending    { background: var(--amber-pale);  color: var(--amber);      box-shadow: 0 0 0 2px var(--amber); }
  .mo-dot-processing { background: var(--copper-pale); color: var(--copper-dk);  box-shadow: 0 0 0 2px var(--copper); }
  .mo-dot-shipped    { background: var(--blue-pale);   color: var(--blue);        box-shadow: 0 0 0 2px var(--blue); }
  .mo-dot-delivered  { background: var(--green-pale);  color: var(--green);       box-shadow: 0 0 0 2px var(--green); }
  .mo-dot-cancelled  { background: #fff5f5;             color: #dc2626;            box-shadow: 0 0 0 2px #dc2626; }
  .mo-dot-unpaid     { background: var(--amber-pale);  color: var(--amber);       box-shadow: 0 0 0 2px var(--amber); }

  /* Card */
  .mo-tl-card {
    flex: 1; min-width: 0;
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 14px; overflow: hidden;
    box-shadow: 0 2px 10px rgba(15,30,66,0.06);
    transition: box-shadow 0.25s, border-color 0.25s;
  }
  .mo-tl-item:hover .mo-tl-card { box-shadow: 0 6px 24px rgba(15,30,66,0.1); border-color: rgba(15,30,66,0.15); }
  .mo-tl-item.open  .mo-tl-card { border-color: var(--copper); }

  /* Color bar */
  .mo-tl-bar { height: 3px; }
  .mo-bar-pending    { background: linear-gradient(90deg, var(--amber), #fbbf24); }
  .mo-bar-processing { background: linear-gradient(90deg, var(--copper), var(--copper-lt)); }
  .mo-bar-shipped    { background: linear-gradient(90deg, var(--blue), #60a5fa); }
  .mo-bar-delivered  { background: linear-gradient(90deg, var(--green), #4ade80); }
  .mo-bar-cancelled  { background: linear-gradient(90deg, #dc2626, #f87171); }

  /* Card head */
  .mo-tl-head {
    padding: 1rem 1.25rem;
    display: flex; align-items: center;
    justify-content: space-between; gap: 0.75rem; flex-wrap: wrap;
    cursor: pointer;
  }
  .mo-tl-order-id   { font-size: 0.85rem; font-weight: 800; color: var(--navy); }
  .mo-tl-order-date { font-size: 0.68rem; color: var(--ink4); margin-top: 0.1rem; }
  .mo-tl-head-right { display: flex; align-items: center; gap: 0.55rem; flex-wrap: wrap; }
  .mo-tl-total      { font-size: 0.95rem; font-weight: 800; color: var(--navy); }

  .mo-chevron { color: var(--ink4); transition: transform 0.3s; flex-shrink: 0; }
  .mo-tl-item.open .mo-chevron { transform: rotate(180deg); }

  /* Badges */
  .mo-badge {
    display: inline-flex; align-items: center; gap: 0.28rem;
    font-size: 0.6rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
    padding: 0.18rem 0.58rem; border-radius: 100px; white-space: nowrap;
  }
  .mo-badge-dot { width: 4px; height: 4px; border-radius: 50%; background: currentColor; }
  .mb-pending    { background: var(--amber-pale);  color: var(--amber); }
  .mb-processing { background: var(--copper-pale); color: var(--copper-dk); }
  .mb-shipped    { background: var(--blue-pale);   color: var(--blue); }
  .mb-delivered  { background: var(--green-pale);  color: var(--green); }
  .mb-cancelled  { background: #fff5f5;             color: #dc2626; }
  .mb-paid       { background: var(--green-pale);  color: var(--green); }
  .mb-unpaid     { background: var(--amber-pale);  color: var(--amber); }
  .mb-failed     { background: #fff5f5;             color: #dc2626; }

  /* ── PROGRESS TRACKER ── */
  .mo-progress {
    padding: 0.9rem 1.25rem 1rem;
    border-top: 1px solid var(--border-lt);
    border-bottom: 1px solid var(--border-lt);
    background: var(--bg-soft);
  }
  .mo-progress-track {
    display: flex; align-items: flex-start;
    position: relative;
  }
  /* Base line */
  .mo-progress-track::before {
    content: '';
    position: absolute; top: 13px; left: 14px; right: 14px; height: 2px;
    background: var(--bg-mid); z-index: 0;
  }

  .mo-step {
    flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.4rem;
    position: relative; z-index: 1;
  }
  /* Filled connector after done step */
  .mo-step.done::after {
    content: '';
    position: absolute; top: 12px; left: 50%; width: 100%; height: 2px;
    background: var(--green); z-index: -1;
  }
  .mo-step.active::after {
    content: '';
    position: absolute; top: 12px; left: 50%; width: 100%; height: 2px;
    background: var(--bg-mid); z-index: -1;
  }
  .mo-step:last-child::after { display: none; }

  .mo-step-icon {
    width: 26px; height: 26px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    background: var(--bg-mid); color: var(--ink4);
    border: 2px solid var(--bg-mid); transition: all 0.3s; flex-shrink: 0;
  }
  .mo-step.done .mo-step-icon   { background: var(--green-pale); color: var(--green); border-color: var(--green); }
  .mo-step.active .mo-step-icon { background: var(--copper-pale); color: var(--copper-dk); border-color: var(--copper); box-shadow: 0 0 0 3px rgba(212,130,58,0.15); }
  .mo-step.cancelled .mo-step-icon { background: #fff5f5; color: #dc2626; border-color: #dc2626; }

  .mo-step-label {
    font-size: 0.58rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;
    color: var(--ink4); text-align: center; line-height: 1.3;
  }
  .mo-step.done .mo-step-label      { color: var(--green); }
  .mo-step.active .mo-step-label    { color: var(--copper-dk); font-weight: 700; }
  .mo-step.cancelled .mo-step-label { color: #dc2626; }

  /* ── Collapsible body ── */
  .mo-tl-body {
    max-height: 0; overflow: hidden;
    transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1);
  }
  .mo-tl-item.open .mo-tl-body { max-height: 2000px; }
  .mo-tl-body-inner { padding: 1.1rem 1.25rem; }

  /* Info chips */
  .mo-info-row { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem; }
  .mo-info-chip {
    background: var(--bg-soft); border: 1px solid var(--border-lt);
    border-radius: 8px; padding: 0.55rem 0.8rem; flex: 1; min-width: 110px;
  }
  .mo-chip-lbl { font-size: 0.57rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink4); margin-bottom: 0.18rem; }
  .mo-chip-val { font-size: 0.8rem; font-weight: 700; color: var(--navy); }

  /* Section label */
  .mo-section-label {
    font-size: 0.6rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--copper-dk); margin-bottom: 0.65rem;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .mo-section-label::after { content:''; flex:1; height:1px; background:var(--border); }

  /* Book items */
  .mo-book-item {
    display: flex; align-items: center; gap: 0.85rem;
    padding: 0.65rem 0; border-bottom: 1px solid var(--border-lt);
  }
  .mo-book-item:last-child { border-bottom: none; }
  .mo-book-cover {
    width: 38px; height: 52px; object-fit: cover; border-radius: 5px; flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(15,30,66,0.15);
  }
  .mo-book-ph {
    width: 38px; height: 52px; background: var(--bg-soft); border: 1px solid var(--border);
    border-radius: 5px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; color: var(--ink4);
  }
  .mo-book-title  { font-size: 0.83rem; font-weight: 700; color: var(--navy); line-height: 1.3; }
  .mo-book-author { font-size: 0.7rem; color: var(--ink3); margin: 0.1rem 0 0.25rem; }
  .mo-book-qty    { font-size: 0.65rem; font-weight: 600; background: var(--bg-soft); color: var(--ink4); padding: 0.08rem 0.42rem; border-radius: 100px; }
  .mo-book-price  { margin-left: auto; font-size: 0.82rem; font-weight: 800; color: var(--navy); white-space: nowrap; }

  /* Total */
  .mo-total-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.85rem 0 0; margin-top: 0.4rem; border-top: 1px solid var(--border);
  }
  .mo-total-lbl { font-size: 0.76rem; font-weight: 600; color: var(--ink3); }
  .mo-total-val { font-size: 1.05rem; font-weight: 800; color: var(--navy); }

  /* Pay btn */
  .mo-pay-btn {
    width: 100%; margin-top: 0.85rem; padding: 0.76rem;
    background: linear-gradient(135deg, var(--copper), var(--copper-dk));
    color: #fff; border: none; cursor: pointer;
    font-family: 'Poppins', sans-serif; font-size: 0.85rem; font-weight: 700;
    border-radius: 9px; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    transition: all 0.22s; box-shadow: 0 4px 14px rgba(212,130,58,0.35);
  }
  .mo-pay-btn:hover { filter: brightness(1.08); transform: translateY(-1px); }
  .mo-pay-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  /* Skeleton */
  .mo-skel-wrap { display: flex; gap: 1.25rem; margin-bottom: 2rem; }
  .mo-skel-dot  { width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0; background: var(--bg-mid); }
  .mo-skel-card {
    flex: 1; background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 14px; padding: 1rem 1.25rem; display:flex; flex-direction:column; gap:0.4rem;
  }
  .mo-skel-bar {
    background: var(--bg-mid); border-radius: 5px;
    position: relative; overflow: hidden;
  }
  .mo-skel-bar::after {
    content:''; position:absolute; inset:0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
    animation: shimmer 1.4s infinite;
  }
  @keyframes shimmer { from{transform:translateX(-100%)} to{transform:translateX(100%)} }

  /* Empty */
  .mo-empty {
    background: var(--bg-card); border: 1px solid var(--border); border-radius: 14px;
    padding: 5rem 2rem; text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
  }
  .mo-empty-icon {
    width: 64px; height: 64px;
    background: linear-gradient(135deg, var(--navy), var(--navy-mid));
    border-radius: 16px; display: flex; align-items: center; justify-content: center;
    color: #fff; margin-bottom: 0.5rem; box-shadow: 0 6px 20px rgba(15,30,66,0.2);
  }
  .mo-empty-title { font-size: 1.1rem; font-weight: 800; color: var(--navy); }
  .mo-empty-desc  { font-size: 0.83rem; color: var(--ink3); }
  .mo-empty-btn {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: linear-gradient(135deg, var(--navy), var(--navy-mid));
    color: #fff; text-decoration: none;
    font-size: 0.85rem; font-weight: 700;
    padding: 0.72rem 1.5rem; border-radius: 9px; margin-top: 0.5rem;
    transition: all 0.22s; box-shadow: 0 4px 14px rgba(15,30,66,0.2);
  }
  .mo-empty-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }

  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
`

// ── Helpers ──────────────────────────────────────────────
const formatPrice = (n) =>
  new Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', minimumFractionDigits:0 }).format(n)

const formatDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' })
}
const formatDateTime = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleString('id-ID', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })
}

// ── Step config ──────────────────────────────────────────
const STEPS = [
  { key:'PENDING',    label:'Menunggu', Icon:Clock },
  { key:'PROCESSING', label:'Diproses', Icon:Package },
  { key:'SHIPPED',    label:'Dikirim',  Icon:Truck },
  { key:'DELIVERED',  label:'Diterima', Icon:MapPin },
]
const STEP_IDX = { PENDING:0, PROCESSING:1, SHIPPED:2, DELIVERED:3, CANCELLED:-1 }

const STATUS_DOT = { PENDING:'mo-dot-pending', PROCESSING:'mo-dot-processing', SHIPPED:'mo-dot-shipped', DELIVERED:'mo-dot-delivered', CANCELLED:'mo-dot-cancelled' }
const STATUS_BAR = { PENDING:'mo-bar-pending', PROCESSING:'mo-bar-processing', SHIPPED:'mo-bar-shipped', DELIVERED:'mo-bar-delivered', CANCELLED:'mo-bar-cancelled' }
const STATUS_ICON = { PENDING:Clock, PROCESSING:Package, SHIPPED:Truck, DELIVERED:CheckCircle, CANCELLED:XCircle }

const PAY_LABEL = { PAID:'Lunas', UNPAID:'Belum Bayar', FAILED:'Gagal', EXPIRED:'Kadaluarsa' }
const PAY_CLS   = { PAID:'mb-paid', UNPAID:'mb-unpaid', FAILED:'mb-failed', EXPIRED:'mb-failed' }
const ORD_LABEL = { PENDING:'Menunggu', PROCESSING:'Diproses', SHIPPED:'Dikirim', DELIVERED:'Diterima', CANCELLED:'Dibatalkan' }
const ORD_CLS   = { PENDING:'mb-pending', PROCESSING:'mb-processing', SHIPPED:'mb-shipped', DELIVERED:'mb-delivered', CANCELLED:'mb-cancelled' }

const TABS = [
  { key:'ALL',        label:'Semua' },
  { key:'UNPAID',     label:'Belum Bayar' },
  { key:'PROCESSING', label:'Diproses' },
  { key:'DELIVERED',  label:'Selesai' },
  { key:'CANCELLED',  label:'Dibatalkan' },
]

// ── Progress Tracker ──────────────────────────────────────
const ProgressTracker = ({ status }) => {
  const cancelled = status === 'CANCELLED'
  const cur = STEP_IDX[status] ?? 0
  return (
    <div className="mo-progress">
      <div className="mo-progress-track">
        {STEPS.map((step, i) => {
          const done   = !cancelled && i < cur
          const active = !cancelled && i === cur
          const cx     = cancelled && i === 0
          const cls    = cx ? 'cancelled' : done ? 'done' : active ? 'active' : ''
          return (
            <div key={step.key} className={`mo-step ${cls}`}>
              <div className="mo-step-icon">
                {cx ? <XCircle size={12}/> : done ? <CheckCircle size={12}/> : <step.Icon size={12}/>}
              </div>
              <div className="mo-step-label">{cx ? 'Batal' : step.label}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────
const MyOrders = () => {
  const [orders, setOrders]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [openId, setOpenId]       = useState(null)
  const [activeTab, setActiveTab] = useState('ALL')
  const [payingId, setPayingId]   = useState(null)

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/orders')
      setOrders(data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handlePayNow = async (order) => {
    setPayingId(order.id)
    try {
      let token = order.snapToken
      if (!token) {
        const { data } = await api.post('/orders/checkout', {
          cartItems: order.items.map(i => ({
            bookId: i.book.id, quantity: i.quantity, price: i.book.price, title: i.book.title,
          })),
        })
        token = data.token
      }
      window.snap.pay(token, {
        onSuccess: () => fetchOrders(),
        onPending: () => fetchOrders(),
        onError:   () => setPayingId(null),
        onClose:   () => setPayingId(null),
      })
    } catch { setPayingId(null) }
  }

  const toggle = (id) => setOpenId(prev => prev === id ? null : id)

  const filtered = orders.filter(o => {
    if (activeTab === 'ALL')        return true
    if (activeTab === 'UNPAID')     return o.paymentStatus === 'UNPAID' || o.paymentStatus === 'FAILED'
    if (activeTab === 'PROCESSING') return o.status === 'PROCESSING' || o.status === 'SHIPPED'
    if (activeTab === 'DELIVERED')  return o.status === 'DELIVERED'
    if (activeTab === 'CANCELLED')  return o.status === 'CANCELLED'
    return true
  })

  const counts = {
    ALL:        orders.length,
    UNPAID:     orders.filter(o => o.paymentStatus === 'UNPAID' || o.paymentStatus === 'FAILED').length,
    PROCESSING: orders.filter(o => o.status === 'PROCESSING' || o.status === 'SHIPPED').length,
    DELIVERED:  orders.filter(o => o.status === 'DELIVERED').length,
    CANCELLED:  orders.filter(o => o.status === 'CANCELLED').length,
  }

  return (
    <div className="mo-root">
      <style>{styles}</style>

      {/* HEADER */}
      <div className="mo-header">
        <div className="mo-header-left">
          <div className="mo-header-eyebrow">Akun Saya</div>
          <h1 className="mo-header-title">Pesanan <em>Saya</em></h1>
        </div>
        <Link to="/books" className="mo-back-btn">
          <ArrowLeft size={14}/> Lanjut Belanja
        </Link>
      </div>

      {/* TABS */}
      <div className="mo-tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`mo-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            {counts[tab.key] > 0 && <span className="mo-tab-count">{counts[tab.key]}</span>}
          </button>
        ))}
      </div>

      {/* MAIN */}
      <div className="mo-main">

        {/* Skeleton */}
        {loading && [...Array(3)].map((_, i) => (
          <div key={i} className="mo-skel-wrap">
            <div className="mo-skel-dot"/>
            <div className="mo-skel-card">
              <div style={{display:'flex',justifyContent:'space-between',gap:'1rem'}}>
                <div className="mo-skel-bar" style={{width:'35%',height:13}}/>
                <div className="mo-skel-bar" style={{width:'22%',height:13}}/>
              </div>
              <div className="mo-skel-bar" style={{width:'52%',height:10}}/>
            </div>
          </div>
        ))}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="mo-empty">
            <div className="mo-empty-icon"><ShoppingBag size={28}/></div>
            <div className="mo-empty-title">
              {activeTab === 'ALL' ? 'Belum Ada Pesanan' : 'Tidak Ada Pesanan di Kategori Ini'}
            </div>
            <div className="mo-empty-desc">
              {activeTab === 'ALL' ? 'Yuk mulai belanja dan temukan buku favoritmu!' : 'Coba pilih kategori lain di atas'}
            </div>
            {activeTab === 'ALL' && (
              <Link to="/books" className="mo-empty-btn"><BookOpen size={15}/> Lihat Katalog</Link>
            )}
          </div>
        )}

        {/* TIMELINE */}
        {!loading && filtered.length > 0 && (
          <div className="mo-timeline">
            {filtered.map((order, idx) => {
              const isOpen  = openId === order.id
              const unpaid  = order.paymentStatus === 'UNPAID' || order.paymentStatus === 'FAILED'
              const DotIcon = STATUS_ICON[order.status] || Clock
              const dotCls  = unpaid ? 'mo-dot-unpaid' : (STATUS_DOT[order.status] || 'mo-dot-pending')
              const barCls  = STATUS_BAR[order.status] || 'mo-bar-pending'

              return (
                <div
                  key={order.id}
                  className={`mo-tl-item ${isOpen ? 'open' : ''}`}
                  style={{animationDelay:`${idx * 0.07}s`}}
                >
                  {/* Dot */}
                  <div className={`mo-tl-dot ${dotCls}`} onClick={() => toggle(order.id)}>
                    <DotIcon size={16}/>
                  </div>

                  {/* Card */}
                  <div className="mo-tl-card">
                    <div className={`mo-tl-bar ${barCls}`}/>

                    {/* Head */}
                    <div className="mo-tl-head" onClick={() => toggle(order.id)}>
                      <div>
                        <div className="mo-tl-order-id">Pesanan #{order.id}</div>
                        <div className="mo-tl-order-date">{formatDateTime(order.createdAt)}</div>
                      </div>
                      <div className="mo-tl-head-right">
                        <span className={`mo-badge ${PAY_CLS[order.paymentStatus] || 'mb-unpaid'}`}>
                          <span className="mo-badge-dot"/>
                          {PAY_LABEL[order.paymentStatus] || 'Belum Bayar'}
                        </span>
                        <span className={`mo-badge ${ORD_CLS[order.status] || 'mb-pending'}`}>
                          <span className="mo-badge-dot"/>
                          {ORD_LABEL[order.status] || order.status}
                        </span>
                        <div className="mo-tl-total">{formatPrice(order.totalAmount)}</div>
                        <ChevronDown size={15} className="mo-chevron"/>
                      </div>
                    </div>

                    {/* Progress — always visible */}
                    <ProgressTracker status={order.status}/>

                    {/* Collapsible detail */}
                    <div className="mo-tl-body">
                      <div className="mo-tl-body-inner">

                        {/* Info chips */}
                        <div className="mo-info-row">
                          <div className="mo-info-chip">
                            <div className="mo-chip-lbl">ID Transaksi</div>
                            <div className="mo-chip-val" style={{fontSize:'0.72rem',wordBreak:'break-all'}}>{order.midtransOrderId || '—'}</div>
                          </div>
                          <div className="mo-info-chip">
                            <div className="mo-chip-lbl">Metode Bayar</div>
                            <div className="mo-chip-val">{order.paymentMethod ? order.paymentMethod.replace(/_/g,' ').toUpperCase() : '—'}</div>
                          </div>
                          <div className="mo-info-chip">
                            <div className="mo-chip-lbl">Tgl Bayar</div>
                            <div className="mo-chip-val">{formatDate(order.paidAt)}</div>
                          </div>
                        </div>

                        {/* Books */}
                        <div className="mo-section-label">Item Pesanan</div>
                        <div>
                          {order.items?.map(item => (
                            <div key={item.id} className="mo-book-item">
                              {item.book?.coverImage
                                ? <img src={item.book.coverImage} alt={item.book.title} className="mo-book-cover"/>
                                : <div className="mo-book-ph"><BookOpen size={13}/></div>
                              }
                              <div style={{flex:1,minWidth:0}}>
                                <div className="mo-book-title">{item.book?.title || 'Buku'}</div>
                                <div className="mo-book-author">{item.book?.author}</div>
                                <span className="mo-book-qty">{item.quantity}×</span>
                              </div>
                              <div className="mo-book-price">{formatPrice(item.price * item.quantity)}</div>
                            </div>
                          ))}
                        </div>

                        {/* Total */}
                        <div className="mo-total-row">
                          <span className="mo-total-lbl">Total Pembayaran</span>
                          <span className="mo-total-val">{formatPrice(order.totalAmount)}</span>
                        </div>

                        {/* Pay now */}
                        {unpaid && (
                          <button
                            className="mo-pay-btn"
                            onClick={() => handlePayNow(order)}
                            disabled={payingId === order.id}
                          >
                            {payingId === order.id
                              ? <><RefreshCw size={14} style={{animation:'spin 1s linear infinite'}}/> Memproses...</>
                              : <><CreditCard size={14}/> Bayar Sekarang</>
                            }
                          </button>
                        )}

                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrders