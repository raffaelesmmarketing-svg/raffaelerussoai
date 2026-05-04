import Reveal from '@/components/Reveal'

interface Video {
  id: string
  title: string
}

interface Props {
  videos?: Video[]
  label?: string
  sectionTitle?: string
}

const defaultVideos: Video[] = [
  { id: 'SOSTITUISCI_1', title: 'Ultimo video — titolo da aggiornare' },
  { id: 'SOSTITUISCI_2', title: 'Secondo video — titolo da aggiornare' },
  { id: 'SOSTITUISCI_3', title: 'Terzo video — titolo da aggiornare' },
]

export default function VideoEmbed({
  videos = defaultVideos,
  label = 'Dal canale YouTube',
  sectionTitle = 'Guarda gli ultimi video',
}: Props) {
  return (
    <section className="py-32 border-t border-white/[0.08]">
      <div className="max-w-[1200px] mx-auto px-8">
        <Reveal className="text-center mb-12">
          <div className="eyebrow">{label}</div>
          <h2
            className="font-display font-extrabold tracking-[-0.02em] mt-3 text-white"
            style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}
          >
            {sectionTitle}
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {videos.map((video, i) => (
            <Reveal key={video.id} delay={i * 0.1}>
              <div className="flex flex-col gap-3">
                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/[0.08] bg-navy-800">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
                <p className="font-body text-sm text-fog-300 leading-snug px-1">
                  {video.title}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="text-center mt-10">
          <a
            href="https://youtube.com/@raffaelerussoai"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 font-display font-bold text-sm tracking-[0.06em] uppercase text-lime-500 hover:gap-3 transition-all duration-200"
          >
            Vai al canale YouTube →
          </a>
        </Reveal>
      </div>
    </section>
  )
}