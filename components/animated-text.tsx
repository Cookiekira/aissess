import { m } from 'framer-motion'

export type AnimatedTextProps = {
  text: string
  el?: React.ElementType
  duration?: number
  delay?: number
  className?: string
}

const defaultVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

export function AnimatedText({
  text,
  el: Wrapper = 'span',
  delay = 0.01,
  className
}: AnimatedTextProps) {
  if (text === '') return null

  return (
    <Wrapper className={className}>
      <span className="sr-only">{text}</span>

      <m.span
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: delay }}
        aria-hidden
      >
        {text.split('').map((char, index) => (
          <m.span key={index} variants={defaultVariants}>
            {char}
          </m.span>
        ))}
      </m.span>
    </Wrapper>
  )
}
