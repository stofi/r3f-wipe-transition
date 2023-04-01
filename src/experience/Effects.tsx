import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Noise,
  Vignette,
} from '@react-three/postprocessing'

import { useControls } from 'leva'

import CustomEffect from '$/effects/CustomEffect'

export default function Effects() {
  const {
    enableBloom,
    enableDepthOfField,
    enableNoise,
    enableVignette,
    enableCustomEffect,
    luminanceSmoothing,
    luminanceThreshold,
    intensity,
    levels,
    radius,
  } = useControls(
    'Effects',
    {
      enableBloom: {
        value: false,
        label: 'Bloom',
      },
      enableDepthOfField: {
        value: false,
        label: 'Depth of Field',
      },
      enableNoise: {
        value: false,
        label: 'Noise',
      },
      enableVignette: {
        value: false,
        label: 'Vignette',
      },
      enableCustomEffect: {
        value: false,
        label: 'Custom',
      },
      luminanceSmoothing: {
        value: 0.5,
        min: 0,
        max: 1,
        label: 'Smoothing',
      },
      luminanceThreshold: {
        value: 0.1,
        min: 0,
        max: 2,
        label: 'Threshold',
      },
      intensity: {
        value: 0.5,
        min: 0,
        max: 10,
        label: 'Intensity',
      },
      levels: {
        value: 1,
        min: 0,
        max: 10,
        step: 1,
        label: 'Levels',
      },
      radius: {
        value: 4,
        min: 0,
        max: 10,
        label: 'Radius',
      },
    },
    { collapsed: true },
  )

  return (
    <EffectComposer>
      {
        (enableDepthOfField && (
          <DepthOfField
            // worldFocusDistance={10}
            focalLength={0.02}
            bokehScale={20}
            height={1024}
          />
        )) as JSX.Element
      }
      {
        (enableBloom && (
          <Bloom
            luminanceSmoothing={luminanceSmoothing}
            luminanceThreshold={luminanceThreshold}
            intensity={intensity}
            levels={levels}
            radius={radius}
            height={1024}
          />
        )) as JSX.Element
      }
      {(enableNoise && <Noise opacity={0.015} />) as JSX.Element}
      {
        (enableVignette && (
          <Vignette eskil={false} offset={0.1} darkness={0.8} />
        )) as JSX.Element
      }
      {(enableCustomEffect && <CustomEffect param={0.1} />) as JSX.Element}
    </EffectComposer>
  )
}
