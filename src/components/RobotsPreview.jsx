import { Link } from 'react-router-dom'

const robots = [
  {
    name: 'Scout',
    description: 'A beginner-friendly exploration robot for school demos and classroom activities.',
  },
  {
    name: 'Builder',
    description: 'A modular bot for engineering projects, competitions and campus labs.',
  },
  {
    name: 'Rover',
    description: 'An ESP32-powered rover with smart navigation and sensor challenges.',
  },
]

export default function RobotsPreview() {
  return (
    <section className="px-8 py-20 md:px-16 lg:px-24 bg-[#06111f]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 max-w-3xl">
          <span className="inline-block mb-4 text-xs tracking-[0.35em] uppercase text-cyan/70">
            Robot Services
          </span>
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            We manufacture robots and showcase their features for schools and events.
          </h2>
          <p className="mt-6 text-sm leading-7 text-white/70 sm:text-base">
            Each robot is designed to teach concepts like motion control, sensors, and embedded systems through compelling real-world challenges.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {robots.map((robot) => (
            <article key={robot.name} className="group rounded-[32px] border border-white/10 bg-white/5 p-8 transition duration-300 hover:border-cyan/30 hover:bg-white/10">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-2xl font-semibold">{robot.name}</h3>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-cyan/10 text-cyan text-xl">🤖</span>
              </div>
              <p className="mt-5 text-sm leading-7 text-white/70">{robot.description}</p>
              <Link to="/robots" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-cyan transition hover:text-white">
                Learn more
                <span>→</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
