import React from 'react'

const OptimizedImage = ({ src, alt, className, ...props }) => {
  const webpSrc = src?.includes('?') ? `${src}&fm=webp` : `${src}?fm=webp`

  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <img src={src} alt={alt} loading="lazy" className={className} {...props} />
    </picture>
  )
}

export default OptimizedImage
