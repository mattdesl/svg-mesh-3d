attribute vec3 direction;
attribute vec3 centroid;

uniform float animate;
uniform float opacity;
uniform float scale;
varying vec3 vNorm;

#define PI 3.14

void main() {
  vNorm = position.xyz;
  
  float theta = (1.0 - animate) * (PI * 1.5) * sign(centroid.x);
  mat3 rotMat = mat3(
    vec3(cos(theta), 0.0, sin(theta)),
    vec3(0.0, 1.0, 0.0),
    vec3(-sin(theta), 0.0, cos(theta))
  );
  
  vec3 offset = mix(vec3(0.0), direction.xyz * rotMat, 1.0 - animate);
  vec3 tPos = mix(centroid.xyz, position.xyz, scale) + offset;
  
  gl_Position = projectionMatrix *
              modelViewMatrix *
              vec4(tPos, 1.0);
}