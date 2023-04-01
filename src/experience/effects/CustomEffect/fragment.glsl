uniform float param;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    outputColor = inputColor;
    outputColor.rgb = inputColor.rgb * param;
}