'use client'

import Image, { type StaticImageData } from 'next/image'
import { useImageLightbox } from './ImageLightbox'

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

type LightboxImageProps = {
  src: StaticImageData | string
  alt: string
  title: string
  description: string
  sizes?: string
  priority?: boolean
  className?: string
  imageClassName?: string
}

export function LightboxImage({
  src,
  alt,
  title,
  description,
  sizes,
  priority,
  className,
  imageClassName
}: LightboxImageProps) {
  const { open } = useImageLightbox()

  return (
    <button
      type="button"
      onClick={() =>
        open({
          src,
          alt,
          title,
          description
        })
      }
      className={cx(
        'group relative block overflow-hidden text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500',
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={cx('object-cover transition duration-300 group-hover:scale-[1.04]', imageClassName)}
        sizes={sizes}
        priority={priority}
      />
      <span className="sr-only">View {title} visual in a larger modal</span>
    </button>
  )
}
