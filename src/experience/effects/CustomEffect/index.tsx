/* eslint-disable @typescript-eslint/no-unused-vars */
import { Uniform, WebGLRenderer, WebGLRenderTarget } from 'three'
import React, { forwardRef, useMemo } from 'react'

import { Effect } from 'postprocessing'

import fragmentShader from './fragment.glsl'

// Effect implementation
class CustomEffectImpl extends Effect {
  static _param = 0.1
  constructor({ param = 0.1 } = {}) {
    super('MyCustomEffect', fragmentShader, {
      uniforms: new Map([['param', new Uniform(param)]]),
    })

    CustomEffectImpl._param = param
  }

  update(
    renderer: WebGLRenderer,
    inputBuffer: WebGLRenderTarget,
    deltaTime?: number,
  ) {
    const paramUniform = this.uniforms.get('param')
    if (!paramUniform) return
    paramUniform.value = CustomEffectImpl._param
  }
}

// Effect component
export const CustomEffect = forwardRef<
  any,
  {
    param: number
  }
>(function CustomEffect({ param }, ref) {
  const effect = useMemo(() => new CustomEffectImpl({ param }), [param])

  return <primitive ref={ref} object={effect} dispose={null} />
})

export default CustomEffect
