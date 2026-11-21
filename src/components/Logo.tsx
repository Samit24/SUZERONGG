import "./styles/Logo.css";

// Suzeron logo: a round seal with an "S" monogram, crossed by an orbit
// (echoing the 3D globe), next to a serif wordmark.
const Logo = () => (
  <span className="logo" aria-label="Suzeron">
    <svg className="logo-mark" viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#67e8f9" />
          <stop offset="75%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      {/* seal */}
      <circle cx="24" cy="24" r="19" fill="rgba(34,211,238,0.06)" stroke="url(#logoGrad)" strokeWidth="1.6" />
      <circle cx="24" cy="24" r="15.5" fill="none" stroke="rgba(103,232,249,0.25)" strokeWidth="0.8" strokeDasharray="1.5 2.5" />
      {/* "S" monogram drawn as an outline (Space Grotesk Bold) so it matches the tab icon exactly */}
      <path d="M24.12 32.74L24.12 32.74Q22.18 32.74 20.69 32.04Q19.20 31.34 18.36 30.05Q17.52 28.75 17.52 26.93L17.52 26.93L17.52 26.26L20.64 26.26L20.64 26.93Q20.64 28.44 21.58 29.20Q22.51 29.95 24.12 29.95L24.12 29.95Q25.75 29.95 26.56 29.30Q27.36 28.66 27.36 27.65L27.36 27.65Q27.36 26.95 26.96 26.52Q26.57 26.09 25.81 25.81Q25.06 25.54 23.98 25.30L23.98 25.30L23.42 25.18Q21.70 24.79 20.46 24.20Q19.22 23.62 18.56 22.66Q17.90 21.70 17.90 20.16L17.90 20.16Q17.90 18.62 18.64 17.53Q19.37 16.44 20.70 15.85Q22.03 15.26 23.83 15.26L23.83 15.26Q25.63 15.26 27.04 15.88Q28.44 16.49 29.24 17.70Q30.05 18.91 30.05 20.74L30.05 20.74L30.05 21.46L26.93 21.46L26.93 20.74Q26.93 19.78 26.56 19.19Q26.18 18.60 25.49 18.32Q24.79 18.05 23.83 18.05L23.83 18.05Q22.39 18.05 21.71 18.59Q21.02 19.13 21.02 20.06L21.02 20.06Q21.02 20.69 21.35 21.12Q21.67 21.55 22.32 21.84Q22.97 22.13 23.98 22.34L23.98 22.34L24.53 22.46Q26.33 22.85 27.66 23.45Q28.99 24.05 29.74 25.03Q30.48 26.02 30.48 27.55L30.48 27.55Q30.48 29.09 29.70 30.25Q28.92 31.42 27.49 32.08Q26.06 32.74 24.12 32.74Z" fill="url(#logoGrad)" />
      {/* orbit + satellite */}
      <g className="logo-orbit">
        <ellipse cx="24" cy="24" rx="23" ry="7.5" transform="rotate(-24 24 24)" fill="none" stroke="url(#logoGrad)" strokeWidth="1.1" opacity="0.85" />
        <circle cx="45" cy="15.2" r="2.1" fill="#ffffff" />
      </g>
    </svg>
    <span className="logo-word" aria-hidden="true">
      Suzeron<span className="logo-dot">.</span>
    </span>
  </span>
);

export default Logo;
