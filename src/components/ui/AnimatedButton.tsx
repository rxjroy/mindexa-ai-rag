import React from 'react';

interface AnimatedButtonProps {
  href?: string;
  onClick?: () => void;
  label?: string;
}

const styles = `
  .ag-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 16px 36px;
    border: 4px solid transparent;
    font-size: 16px;
    background-color: transparent;
    border-radius: 100px;
    font-weight: 600;
    color: #D4AF37;
    box-shadow: 0 0 0 2px #D4AF37;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    text-decoration: none;
    font-family: inherit;
    letter-spacing: 0.08em;
  }

  .ag-btn .ag-arr-1,
  .ag-btn .ag-arr-2 {
    position: absolute;
    width: 24px;
    fill: #D4AF37;
    z-index: 9;
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .ag-btn .ag-arr-1 { right: 16px; }
  .ag-btn .ag-arr-2 { left: -25%; }

  .ag-btn .ag-circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    background-color: #D4AF37;
    border-radius: 50%;
    opacity: 0;
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .ag-btn .ag-text {
    position: relative;
    z-index: 1;
    transform: translateX(-12px);
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .ag-btn:hover {
    box-shadow: 0 0 0 12px transparent;
    color: #0A0A0A;
    border-radius: 12px;
  }

  .ag-btn:hover .ag-arr-1 { right: -25%; }
  .ag-btn:hover .ag-arr-2 { left: 16px; }
  .ag-btn:hover .ag-text  { transform: translateX(12px); }

  .ag-btn:hover .ag-arr-1,
  .ag-btn:hover .ag-arr-2 { fill: #0A0A0A; }

  .ag-btn:active {
    scale: 0.95;
    box-shadow: 0 0 0 4px #FFE55C;
  }

  .ag-btn:hover .ag-circle {
    width: 220px;
    height: 220px;
    opacity: 1;
  }
`;

const ArrowPath = () => (
  <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
);

export default function AnimatedButton({ href, onClick, label = 'E N T R Y' }: AnimatedButtonProps) {
  const inner = (
    <>
      <style>{styles}</style>
      <svg xmlns="http://www.w3.org/2000/svg" className="ag-arr-2" viewBox="0 0 24 24"><ArrowPath /></svg>
      <span className="ag-text">{label}</span>
      <span className="ag-circle" />
      <svg xmlns="http://www.w3.org/2000/svg" className="ag-arr-1" viewBox="0 0 24 24"><ArrowPath /></svg>
    </>
  );

  if (href) {
    return <a href={href} className="ag-btn">{inner}</a>;
  }

  return (
    <button className="ag-btn" onClick={onClick}>
      {inner}
    </button>
  );
}
