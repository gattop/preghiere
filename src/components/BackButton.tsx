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
      ← {label}
    </button>
  )
}
