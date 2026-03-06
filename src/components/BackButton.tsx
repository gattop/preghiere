import { useNavigate } from 'react-router-dom'

interface BackButtonProps {
  to?: string
  label?: string
}

export function BackButton({ to, label = 'Indietro' }: BackButtonProps) {
  const navigate = useNavigate()

  function handleClick() {
    if (to) navigate(to)
    else navigate(-1)
  }

  return (
    <button type="button" className="back-link" onClick={handleClick}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
      {label}
    </button>
  )
}
