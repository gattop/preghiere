import { useSearchParams } from 'react-router-dom'
import BibleSearch from '../components/BibleSearch'
import { useSeo } from '../hooks/useSeo'

export function BiblePage() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''

  useSeo({
    title: 'La Sacra Bibbia CEI 2008',
    description: 'Cerca versetti della Sacra Bibbia CEI 2008 per riferimento. Dal Genesi all’Apocalisse, accedi rapidamente a qualsiasi passo biblico.',
    canonical: 'https://spadadellospirito.org/bibbia',
  })

  return <BibleSearch initialQuery={q} />
}
