import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import testVertexShaders from './shaders/test/vertex.glsl'
import testFragmentShaders from './shaders/test/fragment.glsl'


/**
 * Base
 */
//debug
const gui = new dat.GUI({width: 400})

//textures
const textureLoader = new THREE.TextureLoader()
const flagTexture = textureLoader.load('/textures/flag-french.jpg')

//canvas
const canvas = document.querySelector('canvas.webgl')

//scene
const scene = new THREE.Scene()

//Geometry
const geometry = new THREE.PlaneGeometry(1.1, 1, 32, 32)
const material = new THREE.RawShaderMaterial(
    {
        vertexShader: testVertexShaders,
        fragmentShader: testFragmentShaders,
        side: THREE.DoubleSide,
        transparent: true,
        uniforms:
        {
            uFrequency: {value: new THREE.Vector2(10, 5)},
            uTime: {value: 0},
            uTextures: {value: flagTexture },
            uColor: {value: new THREE.Color('orange')},
        }
})
gui.add(material.uniforms.uFrequency.value, 'x').min(0).max(20).step(0.01).name('Xfrequency')
gui.add(material.uniforms.uFrequency.value, 'y').min(0).max(20).step(0.01).name('Yfrequency')

const count = geometry.attributes.position.count
const randoms = new Float32Array(count)



for(let i = 0; i < count; i++ ){
    randoms[i] = Math.random()
}
geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))


//Mesh
const mesh = new THREE.Mesh(geometry, material)
mesh.receiveShadow = true
mesh.scale.y = 2 / 3
scene.add(mesh)

/**
 * ligths
 */
const ambientLigths = new THREE.AmbientLight('#ffffff', 1)
scene.add(ambientLigths)

const directionalLigth = new THREE.DirectionalLight('#ffffff', 1)
/*directionalLigth.castShadow = true
directionalLigth.shadow.mapSize.set(1024, 1024)
directionalLigth.shadow.camera.far = 15
directionalLigth.shadow.camera.left = -7
directionalLigth.shadow.camera.top = 7
directionalLigth.shadow.camera.right = 7
directionalLigth.shadow.camera.bottom = -7*/
directionalLigth.position.set(5, 5, 5)
scene.add(directionalLigth) 

/**
 * sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    //update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    //update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
//Base Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0.25, -0.25, 1)
scene.add(camera)

//Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const clock = new THREE.Clock()

const tick = () => 
{
    const elapsedTime = clock.getElapsedTime()

    //material
    material.uniforms.uTime.value = elapsedTime

    //update Controls
    controls.update()

    //Render
    renderer.render(scene, camera)

    // call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
