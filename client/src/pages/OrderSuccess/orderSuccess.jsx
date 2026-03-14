import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle, Clock, XCircle, Home, ArrowRight, Package, RefreshCw } from 'lucide-react'
import api from '../../services/api'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap');

  :root {
    --border: rgba(15,30,66,0.1);
    --bg-page:   #f7f8ff;
    --bg-card:   #ffffff;
    --bg-soft:   #eef2ff;
    --navy:      #162a57;
    --navy-mid:  #1f3873;
    --navy-lt:   #2a478a;
    --navy-pale: #e3e9fb;
    --green: #2d6a4f;
    --green-pale: #d8f3e8;
    --copper:      #d98942;
    --copper-dk:   #b96e2f;
    --copper-lt:   #eba56a;
    --copper-pale: #fdf0df;
    --ink:    #0f1e42;
    --ink-2:  #3a4a6e;
    --ink-3:  #6272a0;
    --ink-4:  #9aa3c2;
    --bdr:     rgba(15,30,66,0.1);
    --bdr-lt:  rgba(15,30,66,0.06);
  }
  }

  .os-root {
    font-family: 'Poppins', sans-serif;
    background: var(--bg-page); color: var(--navy);
    min-height: 100vh;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 2rem;
  }

  .os-card {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 20px; padding: 3rem 2.5rem;
    max-width: 480px; width: 100%; text-align: center;
    box-shadow: 0 8px 32px rgba(15,30,66,0.1);
    animation: fadeUp 0.4s cubic-bezier(0.16,1,0.3,1);
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(24px); }
    to   { opacity:1; transform:translateY(0); }
  }

  .os-icon-wrap {
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 1.25rem;
  }
  .os-icon-success { color: var(--green); }
  .os-icon-pending { color: var(--copper); }
  .os-icon-failed  { color: #dc2626; }

  .os-skeleton {
    display: flex; flex-direction: column; align-items: center; gap: 0.9rem;
    margin-bottom: 1.75rem;
  }
  .os-skel-circle {
    width: 64px; height: 64px; border-radius: 50%;
    background: var(--bg-soft); position: relative; overflow: hidden;
  }
  .os-skel-bar {
    border-radius: 6px; background: var(--bg-soft);
    position: relative; overflow: hidden;
  }
  .os-skel-circle::after, .os-skel-bar::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
    animation: shimmer 1.4s infinite;
  }
  @keyframes shimmer { from{transform:translateX(-100%)} to{transform:translateX(100%)} }

  .os-title { font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem; }
  .os-desc  { font-size: 0.85rem; color: var(--ink3); line-height: 1.7; margin-bottom: 1.75rem; }

  .os-info-box {
    background: var(--bg-soft); border: 1px solid var(--border);
    border-radius: 10px; padding: 1rem 1.25rem;
    margin-bottom: 1.75rem; text-align: left;
  }
  .os-info-row {
    display: flex; justify-content: space-between; align-items: center;
    font-size: 0.8rem; padding: 0.3rem 0;
    border-bottom: 1px solid var(--border);
  }
  .os-info-row:last-child { border-bottom: none; }
  .os-info-label { color: var(--ink4); }
  .os-info-val   { font-weight: 700; color: var(--navy); }

  .os-status-paid    { background: var(--green-pale); color: var(--green); padding: 0.15rem 0.65rem; border-radius: 100px; font-size: 0.68rem; font-weight: 700; }
  .os-status-pending { background: var(--copper-pale); color: var(--copper); padding: 0.15rem 0.65rem; border-radius: 100px; font-size: 0.68rem; font-weight: 700; }
  .os-status-failed  { background: #fff5f5; color: #dc2626; padding: 0.15rem 0.65rem; border-radius: 100px; font-size: 0.68rem; font-weight: 700; }

  .os-btns { display: flex; flex-direction: column; gap: 0.7rem; }
  .os-btn-primary {
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    background: linear-gradient(135deg, var(--navy), var(--navy-mid));
    color: #fff; text-decoration: none;
    font-size: 0.88rem; font-weight: 700;
    padding: 0.8rem; border-radius: 10px;
    transition: all 0.22s; box-shadow: 0 4px 14px rgba(15,30,66,0.2);
  }
  .os-btn-primary:hover { filter: brightness(1.08); transform: translateY(-1px); }
  .os-btn-secondary {
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    background: var(--bg-soft); border: 1px solid var(--border);
    color: var(--ink2); text-decoration: none;
    font-size: 0.85rem; font-weight: 600;
    padding: 0.75rem; border-radius: 10px; transition: all 0.2s;
  }
  .os-btn-secondary:hover { border-color: var(--navy); color: var(--navy); }
`

const formatPrice = (n) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(n)

const OrderSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()

  // Cart.jsx mengirim: { orderId, paymentStatus, pending?, result }
  const { orderId, paymentStatus: statePaymentStatus, pending } = location.state || {}

  const [order, setOrder]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) { navigate('/'); return }
    fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const { data } = await api.get(`/orders/${orderId}`)
      setOrder(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Prioritas: gunakan paymentStatus dari navigation state (dari Midtrans callback)
  // karena lebih cepat & akurat — tidak bergantung webhook yang mungkin belum selesai.
  // Fallback ke data order dari DB jika state tidak ada.
  const resolvedStatus = statePaymentStatus || order?.paymentStatus

  const isPaid    = resolvedStatus === 'PAID'
  const isPending = !isPaid && (pending || resolvedStatus === 'UNPAID')
  const isFailed  = !loading && !isPaid && !isPending

  return (
    <div className="os-root">
      <style>{styles}</style>
      <div className="os-card">

        {/* Skeleton saat fetch */}
        {loading && (
          <div className="os-skeleton">
            <div className="os-skel-circle" />
            <div className="os-skel-bar" style={{ width: 200, height: 20 }} />
            <div className="os-skel-bar" style={{ width: 280, height: 13 }} />
            <div className="os-skel-bar" style={{ width: 240, height: 13 }} />
          </div>
        )}

        {!loading && (
          <>
            {/* Icon — flex wrapper agar center */}
            <div className="os-icon-wrap">
              {isPaid    && <CheckCircle size={64} className="os-icon-success" />}
              {isPending && <Clock       size={64} className="os-icon-pending" />}
              {isFailed  && <XCircle    size={64} className="os-icon-failed"  />}
            </div>

            <div className="os-title">
              {isPaid    && 'Pembayaran Berhasil! 🎉'}
              {isPending && 'Menunggu Pembayaran'}
              {isFailed  && 'Pembayaran Gagal'}
            </div>

            <div className="os-desc">
              {isPaid    && 'Terima kasih! Pesananmu sedang diproses dan akan segera dikirim.'}
              {isPending && 'Silakan selesaikan pembayaran sesuai metode yang dipilih. Pesanan akan diproses setelah pembayaran dikonfirmasi.'}
              {isFailed  && 'Pembayaran tidak berhasil. Kamu bisa mencoba kembali dari halaman keranjang.'}
            </div>

            {order && (
              <div className="os-info-box">
                <div className="os-info-row">
                  <span className="os-info-label">ID Pesanan</span>
                  <span className="os-info-val">#{order.id}</span>
                </div>
                <div className="os-info-row">
                  <span className="os-info-label">Total</span>
                  <span className="os-info-val">{formatPrice(order.totalAmount)}</span>
                </div>
                <div className="os-info-row">
                  <span className="os-info-label">Status</span>
                  {isPaid    && <span className="os-status-paid">✓ Lunas</span>}
                  {isPending && <span className="os-status-pending">⏳ Menunggu</span>}
                  {isFailed  && <span className="os-status-failed">✗ Gagal</span>}
                </div>
                {order.paymentMethod && (
                  <div className="os-info-row">
                    <span className="os-info-label">Metode</span>
                    <span className="os-info-val">
                      {order.paymentMethod.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="os-btns">
              {(isPaid || isPending) && (
                <Link to="/orders" className="os-btn-primary">
                  <Package size={16} /> Lihat Pesanan Saya <ArrowRight size={14} />
                </Link>
              )}
              <Link to="/" className="os-btn-secondary">
                <Home size={15} /> Kembali ke Beranda
              </Link>
              {isFailed && (
                <Link to="/cart" className="os-btn-secondary">
                  <RefreshCw size={15} /> Coba Lagi
                </Link>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  )
}

export default OrderSuccess
