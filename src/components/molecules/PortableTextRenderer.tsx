import { PortableText } from '@portabletext/react'

const components = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-earth-forest font-light leading-relaxed mb-4">{children}</p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="font-serif italic text-3xl text-earth-forest mt-8 mb-3 leading-[1.15] tracking-[-0.02em]">
        {children}
      </h2>
    ),
  },
  marks: {
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic text-earth-terracotta">{children}</em>
    ),
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-medium text-earth-forest">{children}</strong>
    ),
  },
}

export function PortableTextRenderer({ value }: { value: unknown[] }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <PortableText value={value as any} components={components} />
}
