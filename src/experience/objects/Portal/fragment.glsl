varying vec2 vUv;

uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform float uValue;



void main() {
  vec2 uv = vUv;
  vec4 color1 = vec4(0.0, 0.0, 0.0, 1.0);
  vec4 color2 = vec4(0.0, 0.0, 0.0, 1.0);
  color1 = texture2D(uTexture1, uv);
  color2 = texture2D(uTexture2, uv);

  
  vec4 color = mix(color1, color2, abs(uValue));
  
  
  gl_FragColor = color;
}
