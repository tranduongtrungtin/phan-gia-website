'use client'

import { useEffect, useState } from 'react'

export default function HeroSlider({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [images.length])

  if (images.length === 0) return null

  return (
    <>
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt="Công trình quảng cáo Phan Gia"
          style={{
            position: i === 0 ? 'static' : 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: i === index ? 1 : 0,
            transition: 'opacity 0.8s ease',
          }}
        />
      ))}
    </>
  )
}