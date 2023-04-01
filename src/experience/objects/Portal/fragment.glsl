varying vec2 vUv;

uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform float uValue;
uniform vec2 uCenter;
uniform vec2 uResolution;

const float PI = 3.1415926535897932384626433832795;

float circle(vec2 uv, vec2 center, float radius) {
  float dist = distance(uv, center);
  return smoothstep(radius, radius + 0.01, dist);
}

vec2 rotate(vec2 uv, vec2 center, float angle) {
  vec2 diff = uv - center;
  float s = sin(angle);
  float c = cos(angle);
  return vec2(diff.x * c - diff.y * s, diff.x * s + diff.y * c) + center;
}

void main() {
  vec2 uv = vUv;
  vec4 color1 = vec4(0.0, 0.0, 0.0, 1.0);
  vec4 color2 = vec4(0.0, 0.0, 0.0, 1.0);
  float x = uValue -.5;
  // color1 = texture2D(uTexture1, uv);
  // color2 = texture2D(uTexture2, uv);

  float ascpect = uResolution.x / uResolution.y;
  vec2 uv1 = (uv - 0.5) * vec2(ascpect, 1.0) + 0.5;

  
  vec4 color = vec4(0.0, 0.0, 0.0, 1.0);

  color.rgba = vec4(1.);

  float f =distance(uv1, uCenter);

  float steps = 16.;
  f=1.-floor(f*steps)/steps;
  f=pow(f, 2.0);
  color.rgb = vec3(f);
  vec2 uv3 = rotate(uv1, uCenter, f * (x+.5)  );
  vec2 uv4 = rotate(uv1, uCenter, f * (x-.5)  );
  // color.rgb = vec3(uv2, 0.);

  // uv2 = (uv2)/vec2(ascpect, 1.0) ;

  color1 = texture2D(uTexture1, (uv3 -.5) / vec2(ascpect, 1.0) + 0.5);
  color2 = texture2D(uTexture2, (uv4 -.5) / vec2(ascpect, 1.0) + 0.5);


  color = mix(color1, color2, uValue);
  
  
  gl_FragColor = color;
}
