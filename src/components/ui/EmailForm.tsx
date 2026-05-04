'use client'

interface Props {
  buttonLabel?: string
  centered?: boolean
}

export default function EmailForm({ buttonLabel = 'Scarica gratis →', centered = false }: Props) {
  return (
    <form
      className={`flex flex-col gap-3 ${centered ? '' : ''}`}
      onSubmit={e => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="La tua email"
        className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-400"
      />
      <button
        type="submit"
        className="px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
      >
        {buttonLabel}
      </button>
    </form>
  )
}