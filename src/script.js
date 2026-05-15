import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/Addons.js'
import { TextGeometry } from 'three/examples/jsm/Addons.js'
import { color } from 'three/tsl'

/**
 * Base
 */
// Debug
const gui = new GUI()
gui.$title.style.display = 'none'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Axes helper
// const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/g.png')
matcapTexture.colorSpace = THREE.SRGBColorSpace
const studioTexture = textureLoader.load('/textures/matcaps/3.png')
studioTexture.colorSpace = THREE.SRGBColorSpace
const matcapDonutTexture = textureLoader.load('/textures/matcaps/2.png')
matcapDonutTexture.colorSpace = THREE.SRGBColorSpace

/**
 * Params
 */
const params = {
    count: 2000
}

/**
 * Fonts
 */
const fontLoader = new FontLoader()

fontLoader.load(
    '/fonts/Poppins_Bold.json',
    (font) => {
        const textGeometry = new TextGeometry(
            'ReinOnlein',
            {
                font: font,
                size: 0.5,
                depth: 0.15,
                curveSegments: 30,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 12
            }

        )

        textGeometry.center()

        const reinGeometry = new TextGeometry(
            'Rein',
            {
                font: font,
                size: 0.72,
                depth: 0.15,
                curveSegments: 30,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 12
            }
        )

        reinGeometry.center()

        const onleinGeometry = new TextGeometry(
            'Onlein',
            {
                font: font,
                size: 0.5,
                depth: 0.15,
                curveSegments: 30,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 12
            }
        )

        onleinGeometry.center()

        const studioGeometry = new TextGeometry(
            'Studio',
            {
                font: font,
                size: 0.5,
                depth: 0.15,
                curveSegments: 30,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 12
            }
        )

        studioGeometry.center()


        const matcapMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
        const studioMaterial = new THREE.MeshMatcapMaterial({ matcap: studioTexture })
        const mesh = new THREE.Mesh(textGeometry, studioMaterial)
        const reinMesh = new THREE.Mesh(reinGeometry, studioMaterial)
        const onleinMesh = new THREE.Mesh(onleinGeometry, studioMaterial)
        const studioMesh = new THREE.Mesh(studioGeometry, matcapMaterial)


        // vertical logo
        scene.add(reinMesh, onleinMesh, studioMesh)
        reinMesh.position.y = 0.8
        studioMesh.position.y = -0.7

        // horizontal logo
        // scene.add(mesh, studioMesh)
        // studioMesh.position.y = -0.7


        const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
        const sphereGeometry = new THREE.SphereGeometry(0.12, 24, 24)
        const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapDonutTexture })

        const donuts = []

        const generateDonuts = () => {
            for (const donut of donuts) {
                scene.remove(donut)
            }
            donuts.length = 0

            for (let i = 0; i < params.count; i++) {
                const donut = new THREE.Mesh(sphereGeometry, donutMaterial)

                donut.position.x = (Math.random() - 0.5) * 100
                donut.position.y = (Math.random() - 0.5) * 100
                donut.position.z = (Math.random() - 0.5) * 100
                donut.rotation.x = Math.random() * Math.PI
                donut.rotation.y = Math.random() * Math.PI
                donut.rotation.z = Math.random() * Math.PI

                const scale = Math.random()
                donut.scale.set(scale, scale, scale)
                scene.add(donut)
                donuts.push(donut)
            }
        }

        generateDonuts()
        gui.add(params, 'count').min(100).max(15000).step(100).name('Aantal sterren').onFinishChange(generateDonuts)

    }
)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0.7
camera.position.y = -0.2
camera.position.z = 2.5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
// renderer.setClearColor('#FFFFFF')
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()