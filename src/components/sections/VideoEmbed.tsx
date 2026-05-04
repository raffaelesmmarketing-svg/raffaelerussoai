import Reveal from '@/components/Reveal'

interface Props {
  videoId?: string
  title?: string
  label?: string
}

export default function VideoEmbed({
  videoId = 'dQw4w9WgXcQ',
  title = 'Guarda il video',
  label = 'YouTube',
}: Props) {
  return (
    <section className="py-32 border-t border-white/[0.08]">
      <div className="max-w-[900px] mx-auto px-8">
        <Reveal className="text-center mb-10">
          <div className="eyebrow">{label}</div>
          <h2
            className="font-display font-extrabold tracking-[-0.02em] mt-3 text-white"
            style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}
          >
            {title}
          </h2>
        </Reveal>

        <Reveal>
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/[0.08] bg-navy-800">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}