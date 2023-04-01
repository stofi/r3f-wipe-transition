import { useEffect, useRef } from 'react'

import { OrbitControls, OrthographicCamera, useFBO } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

import { getFullscreenTriangle } from '$/utils'

import ChildScene, { ChildSceneAPI } from './ChildScene'
import fragmentShader from './fragment.glsl'
import vertexShader from './vertex.glsl'

export default function Portal() {
  const portal1 = useRef<ChildSceneAPI | null>(null)
  const portal2 = useRef<ChildSceneAPI | null>(null)
  const screenCamera = useRef<THREE.OrthographicCamera | null>(null)
  const screenMesh = useRef<THREE.Mesh | null>(null)

  const renderTarget2 = useFBO()
  const renderTarget1 = useFBO()

  useEffect(() => {
    if (portal1.current) portal1.current.show()
    if (portal2.current) portal2.current.show()
  })

  useFrame(({ gl, camera, clock }) => {
    if (!portal1.current || !portal2.current) return
    if (!screenMesh.current) return
    const material = screenMesh.current.material as THREE.ShaderMaterial
    if (!material) return
    const scene1 = portal1.current.scene
    const scene2 = portal2.current.scene
    if (!scene1 || !scene2) return
    gl.setRenderTarget(renderTarget1)
    gl.render(scene1, camera)
    gl.setRenderTarget(renderTarget2)
    gl.render(scene2, camera)
    material.uniforms.uTexture1.value = renderTarget1.texture
    material.uniforms.uTexture2.value = renderTarget2.texture
    material.uniforms.uValue.value = Math.sin(clock.getElapsedTime())
    gl.setRenderTarget(null)
  })

  return (
    <>
      <OrthographicCamera ref={screenCamera} args={[-1, 1, 1, -1, 0, 1]} />
      <mesh
        ref={screenMesh}
        geometry={getFullscreenTriangle()}
        frustumCulled={false}
      >
        <shaderMaterial
          uniforms={{
            uTexture1: {
              value: null,
            },
            uTexture2: {
              value: null,
            },
            uValue: {
              value: 0,
            },
          }}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>

      <OrbitControls makeDefault />
      <ChildScene ref={portal1}>
        <mesh>
          <boxBufferGeometry />
          <meshBasicMaterial color='red' />
        </mesh>
      </ChildScene>
      <ChildScene ref={portal2}>
        <mesh>
          <sphereBufferGeometry />
          <meshBasicMaterial color='orange' />
        </mesh>
      </ChildScene>
    </>
  )
}
