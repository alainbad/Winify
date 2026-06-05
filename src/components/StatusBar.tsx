export default function StatusBar() {
  return (
    <div style={{ height: 44, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
      <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>9:41</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* Signal bars */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="var(--text)">
          <rect x="0" y="8" width="3" height="4" rx="1"/>
          <rect x="4.5" y="5" width="3" height="7" rx="1"/>
          <rect x="9" y="2" width="3" height="10" rx="1"/>
          <rect x="13.5" y="0" width="3" height="12" rx="1"/>
        </svg>
        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="var(--text)">
          <path d="M8 9.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"/>
          <path d="M8 6.5C6.1 6.5 4.4 7.3 3.2 8.6l1.4 1.4A4 4 0 018 8.5a4 4 0 013.4 1.5l1.4-1.4A5.9 5.9 0 008 6.5z" fillOpacity="0.7"/>
          <path d="M8 3.5c-2.8 0-5.3 1.2-7.1 3.1l1.4 1.4A7.9 7.9 0 018 5.5a7.9 7.9 0 015.7 2.5l1.4-1.4A9.8 9.8 0 008 3.5z" fillOpacity="0.4"/>
        </svg>
        {/* Battery */}
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="var(--text)" strokeOpacity="0.4"/>
          <rect x="2" y="2" width="16" height="8" rx="1.5" fill="var(--text)"/>
          <path d="M23 4v4a2 2 0 000-4z" fill="var(--text)" fillOpacity="0.4"/>
        </svg>
      </div>
    </div>
  )
}
