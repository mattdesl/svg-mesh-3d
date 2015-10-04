attribute vec3 direction;
attribute vec3 centroid;

uniform float animate;
uniform float opacity;
uniform float scale;

#define PI 3.14

void main() {
  // rotate the triangles
  // each half rotates the opposite direction
  float theta = (1.0 - animate) * (PI * 1.5) * sign(centroid.x);
  mat3 rotMat = mat3(
    vec3(cos(theta), 0.0, sin(theta)),
    vec3(0.0, 1.0, 0.0),
    vec3(-sin(theta), 0.0, cos(theta))
  );
  
  // push outward
  vec3 offset = mix(vec3(0.0), direction.xyz * rotMat, 1.0 - animate);
  
  // scale triangles to their centroids
  vec3 tPos = mix(centroid.xyz, position.xyz, scale) + offset;
  
  gl_Position = projectionMatrix *
              modelViewMatrix *
              vec4(tPos, 1.0);
}