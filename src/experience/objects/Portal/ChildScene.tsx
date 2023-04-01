import * as THREE from 'three'
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react'

import { Environment } from '@react-three/drei'
import { createPortal, GroupProps, useFrame } from '@react-three/fiber'

const sphere = new THREE.SphereGeometry(1, 16, 16)

const topMaterial = new THREE.MeshBasicMaterial({
  color: '#404040',
  side: THREE.BackSide,
  transparent: true,
  opacity: 0.25,
})

const bottomMaterial = new THREE.MeshBasicMaterial({
  color: '#020202',
  side: THREE.BackSide,
  transparent: true,
  opacity: 0.25,
})

export interface ChildSceneAPI {
  hide: () => void
  show: () => void
  scene: THREE.Scene | null
}

interface ChildSceneProps extends GroupProps {
  color?: string
}

const ChildScene = forwardRef<ChildSceneAPI, ChildSceneProps>(function Scene(
  props,
  ref,
) {
  const groupRef = useRef<THREE.Group | null>(null)

  const active = useRef(false)

  const scene = useMemo(() => new THREE.Scene(), [])

  useImperativeHandle(ref, () => ({
    hide: () => {
      if (groupRef.current) groupRef.current.visible = false
      active.current = false
    },
    show: () => {
      if (groupRef.current) groupRef.current.visible = true
      active.current = true
    },
    scene,
  }))

  useFrame(() => {
    if (!active.current) {
      scene.visible = false

      return
    }
    scene.visible = true
  })

  return createPortal(
    <>
      <Environment
        frames={Infinity}
        background={false}
        // frames={1}
        near={1}
        far={1000}
        resolution={1024 / 4}
      >
        <mesh
          scale={10}
          position={[3, 8, -15]}
          geometry={sphere}
          material={topMaterial}
        />
        <mesh scale={100} geometry={sphere} material={bottomMaterial} />
      </Environment>

      <group ref={groupRef}>{props.children}</group>
    </>,
    scene,
  )
})

export default ChildScene
