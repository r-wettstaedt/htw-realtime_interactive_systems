#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float brightness;

void main(void) {
    vec4 color = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
    if (color.a < 0.5)
        discard;
    gl_FragColor = vec4(color.r * brightness, color.g * brightness, color.b * brightness, color.a - 0.1);
}
