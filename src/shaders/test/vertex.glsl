uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float uTime;
uniform vec2 uFrequency;

attribute vec3 position;
attribute vec2 uv;
attribute float aRandom;


varying float vElevation;
varying float vRandom;


varying vec2 VuV;
varying float u_Time;




void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    modelPosition.z += sin(modelPosition.x * uFrequency.x + uTime) * 0.1;
    modelPosition.z += sin(modelPosition.y * uFrequency.y + uTime) * 0.1;


    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    vRandom = aRandom;

    VuV = uv;
    u_Time = uTime;
}