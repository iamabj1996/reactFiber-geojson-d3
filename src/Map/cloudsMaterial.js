// Import necessary dependencies
import { ShaderMaterial, Vector2 } from 'three';

// Define your cloud vertex shader
const cloudVertexShader = `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Define your cloud fragment shader
const cloudFragmentShader = `
  uniform float time;
  uniform vec2 resolution;
  uniform sampler2D cloudTexture;

  // Perlin noise function
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    // Get the current fragment's UV coordinates
    vec2 uv = gl_FragCoord.xy / resolution;

    // Calculate cloud movement based on time
    vec2 offset = vec2(time * 0.1, 0.0);

    // Sample the cloud texture with offset for animation
    vec4 cloudColor = texture2D(cloudTexture, uv + offset);

    // Add some noise to simulate cloud variation
    float cloudNoise = noise(uv * 10.0) * 0.1;

    // Combine cloud texture and noise
    vec4 finalColor = cloudColor + vec4(cloudNoise);

    gl_FragColor = finalColor;
  }
`;

// Create the cloudsMaterial shader material
const cloudsMaterial = new ShaderMaterial({
	vertexShader: cloudVertexShader,
	fragmentShader: cloudFragmentShader,
	uniforms: {
		time: { value: 0.0 }, // Time uniform for animation
		resolution: { value: new Vector2() }, // Screen resolution
		cloudTexture: { value: null }, // Cloud texture (set this in your application)
	},
});

export default cloudsMaterial;
