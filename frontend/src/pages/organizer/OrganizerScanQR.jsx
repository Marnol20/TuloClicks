import { useEffect, useRef, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import api from '../../services/api'

function OrganizerScanQR() {
  const scannerRef = useRef(null)
  const [scanResult, setScanResult] = useState('')
  const [booking, setBooking] = useState(null)
  const [message, setMessage] = useState('Waiting for scanner...')
  const [scannerReady, setScannerReady] = useState(false)

  useEffect(() => {
    let scannerInstance = null

    async function startScanner() {
      try {
        scannerInstance = new Html5QrcodeScanner(
          'qr-reader',
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
          },
          false
        )

        scannerRef.current = scannerInstance

        scannerInstance.render(
          async (decodedText) => {
            setScanResult(decodedText)
            setMessage(`Scanned: ${decodedText}`)

            try {
              const res = await api.get(`/bookings/verify/${decodedText}`)
              setBooking(res.data.booking || null)
              setMessage('Valid ticket found.')
            } catch (error) {
              console.error('Verify booking error:', error)
              setBooking(null)
              setMessage(error.response?.data?.error || 'Invalid or unreadable ticket.')
            }
          },
          () => {
            // ignore live scan errors
          }
        )

        setScannerReady(true)
      } catch (error) {
        console.error('Scanner init error:', error)
        setMessage('Failed to start QR scanner.')
      }
    }

    startScanner()

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {})
      }
    }
  }, [])

  async function handleCheckIn() {
    if (!booking) return

    try {
      await api.patch(`/bookings/${booking.id}/check-in`)
      setBooking((prev) =>
        prev ? { ...prev, booking_status: 'checked_in' } : null
      )
      setMessage('Attendee checked in successfully.')
    } catch (error) {
      console.error('Check-in error:', error)
      setMessage(error.response?.data?.error || 'Failed to check in attendee.')
    }
  }

  return (
    <main className="reports-page">
      <div className="reports-header">
        <div>
          <h2>QR Ticket Scanner</h2>
          <p>Scan attendee ticket QR codes for event check-in</p>
        </div>
      </div>

      <section className="reports-grid">
        <div className="reports-panel">
          <h3>Scanner</h3>
          <div
            id="qr-reader"
            style={{
              width: '100%',
              minHeight: '320px',
              background: '#0b1220',
              borderRadius: '12px',
              padding: '12px'
            }}
          />
          {!scannerReady && (
            <p style={{ marginTop: '12px', color: '#94a3b8' }}>
              Initializing camera scanner...
            </p>
          )}
        </div>

        <div className="reports-panel">
          <h3>Scan Status</h3>
          <p style={{ color: '#cbd5e1' }}>{message}</p>

          {scanResult && (
            <>
              <p><strong>Scanned Code:</strong> {scanResult}</p>
            </>
          )}

          {booking && (
            <div style={{ marginTop: '16px' }}>
              <p><strong>Reference:</strong> {booking.booking_reference}</p>
              <p><strong>Attendee:</strong> {booking.attendee_name}</p>
              <p><strong>Email:</strong> {booking.attendee_email}</p>
              <p><strong>Event:</strong> {booking.event_title}</p>
              <p><strong>Status:</strong> {booking.booking_status}</p>

              {booking.booking_status !== 'checked_in' ? (
                <button
                  className="reports-refresh-btn"
                  style={{ marginTop: '12px' }}
                  onClick={handleCheckIn}
                >
                  Check In Attendee
                </button>
              ) : (
                <button
                  className="reports-export-btn"
                  style={{ marginTop: '12px' }}
                  disabled
                >
                  Already Checked In
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default OrganizerScanQR