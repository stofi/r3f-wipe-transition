import { ShaderMaterial, Vector2 } from 'three'
import { useEffect, useRef } from 'react'

import {
  Image,
  // OrbitControls,
  OrthographicCamera,
  useFBO,
} from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

import { useControls } from 'leva'

import { getFullscreenTriangle } from '$/utils'

import ChildScene, { ChildSceneAPI } from './ChildScene'
import fragmentShader from './fragment.glsl'
import vertexShader from './vertex.glsl'

const triangle = getFullscreenTriangle()

const shaderMaterial = new ShaderMaterial({
  uniforms: {
    uTexture1: {
      value: null,
    },
    uTexture2: {
      value: null,
    },
    uValue: {
      value: 0,
    },

    uCenter: {
      value: new Vector2(0.5, 0.5),
    },
    uResolution: {
      value: new Vector2(1, 1),
    },
  },
  vertexShader,
  fragmentShader,
})

export default function Portal() {
  const { value } = useControls({
    value: {
      value: 0,
      min: 0,
      max: 1,
    },
  })
  const portal1 = useRef<ChildSceneAPI | null>(null)
  const portal2 = useRef<ChildSceneAPI | null>(null)
  const screenCamera = useRef<THREE.OrthographicCamera | null>(null)
  const screenMesh = useRef<THREE.Mesh | null>(null)
  const resolution = useRef(new Vector2(1, 1))

  const renderTarget2 = useFBO()
  const renderTarget1 = useFBO()

  useEffect(() => {
    if (portal1.current) portal1.current.show()
    if (portal2.current) portal2.current.show()
  }, [])

  useFrame(({ gl, camera, clock }) => {
    if (!portal1.current || !portal2.current) {
      console.warn('Portal not ready')

      return
    }

    if (!screenMesh.current) {
      console.warn('Screen not ready')

      return
    }
    const material = screenMesh.current.material as THREE.ShaderMaterial

    if (!material) {
      console.warn('Material not ready')

      return
    }
    const scene1 = portal1.current.getScene()
    const scene2 = portal2.current.getScene()

    if (!scene1 || !scene2) {
      console.warn('Scene not ready')

      return
    }

    if (!renderTarget1 || !renderTarget2) {
      console.warn('Render target not ready')

      return
    }
    gl.setRenderTarget(renderTarget1)
    gl.render(scene1, camera)
    gl.setRenderTarget(renderTarget2)
    gl.render(scene2, camera)
    material.uniforms.uTexture1.value = renderTarget1.texture
    material.uniforms.uTexture2.value = renderTarget2.texture
    resolution.current.set(gl.domElement.width, gl.domElement.height)
    material.uniforms.uResolution.value = resolution.current
    material.uniforms.uValue.value = value
    // material.uniforms.uValue.value = clock.getElapsedTime()
    gl.setRenderTarget(null)
  })

  console.log('render portal')

  return (
    <>
      <OrthographicCamera ref={screenCamera} args={[-1, 1, 1, -1, 0, 1]} />
      <mesh
        ref={screenMesh}
        geometry={triangle}
        frustumCulled={false}
        material={shaderMaterial}
      ></mesh>

      {/* <OrbitControls makeDefault /> */}
      <OrthographicCamera makeDefault position={[0, 0, 1]} zoom={200} />

      <ChildScene ref={portal1}>
        {/* <mesh>
          <boxGeometry />
          <meshBasicMaterial color='red' />
        </mesh> */}
        <Image url='/file1.png' scale={[10, 10]} />
      </ChildScene>
      <ChildScene ref={portal2}>
        {/* <mesh>
          <sphereGeometry />
          <meshBasicMaterial color='orange' />
        </mesh> */}

        <Image url='/file2.png' scale={[10, 10]} />
      </ChildScene>
    </>
  )
}
