import { BufferGeometry, Float32BufferAttribute } from 'three'

function getFullscreenTriangle() {
  const geometry = new BufferGeometry()

  geometry.setAttribute(
    'position',
    new Float32BufferAttribute([-1, -1, 3, -1, -1, 3], 2),
  )

  geometry.setAttribute('uv', new Float32BufferAttribute([0, 0, 2, 0, 0, 2], 2))

  return geometry
}

function interpolate(t: number, startT: number, endT: number, spread: number) {
  if (t < startT - spread) {
    return 0
  } else if (t <= startT + spread) {
    const ratio = (t - (startT - spread)) / (2 * spread)

    return ratio
  } else if (t < endT - spread) {
    return 1
  } else if (t <= endT + spread) {
    const ratio = 1 - (t - (endT - spread)) / (2 * spread)

    return ratio
  } else {
    return 0
  }
}

export { getFullscreenTriangle, interpolate }
