import type { PrayerBlock } from '../types'

interface Props {
  block: PrayerBlock
}

export function PrayerBlockRenderer({ block }: Props) {
  switch (block.type) {
    case 'paragraph':
      return <p>{block.text}</p>

    case 'italic':
      return <span className="block-italic">{block.text}</span>

    case 'heading':
      return <h3>{block.text}</h3>

    case 'verse':
      return (
        <p className="block-verse">
          {block.lines.map((line, i) => (
            <span key={i}>
              {line}
              {i < block.lines.length - 1 && <br />}
            </span>
          ))}
        </p>
      )

    case 'response':
      return (
        <div className="block-response">
          <span className="block-response-prompt">{block.prompt}</span>
          <span className="block-response-answer">{block.response}</span>
        </div>
      )

    case 'repetition':
      return (
        <p className="block-repetition">
          {block.text} <em>×{block.count}</em>
        </p>
      )

    case 'litany':
      return (
        <table className="litany-table">
          <tbody>
            {block.rows.map((row, i) => (
              <tr key={i}>
                <td>{row.prompt}</td>
                <td>{row.response}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )

    case 'divider':
      return <hr />

    default:
      return null
  }
}
