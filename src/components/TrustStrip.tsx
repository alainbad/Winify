export default function TrustStrip() {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 12, overflowX: 'auto', margin: '0 16px 12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', flexShrink: 0 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10" stroke="#059669"/></svg>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#059669' }}>Verified Fair Draw</span>
      </div>
      <div style={{ width: 1, height: 16, background: 'var(--border)', flexShrink: 0 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', flexShrink: 0 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669', display: 'inline-block', animation: 'livepulse 1.8s ease-in-out infinite' }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sec)' }}>RANDOM.ORG Signed API</span>
      </div>
      <div style={{ width: 1, height: 16, background: 'var(--border)', flexShrink: 0 }} />
      <div style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sec)' }}>● 38 live draws</span>
      </div>
    </div>
  )
}
