import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene 场景
const scene = new THREE.Scene()

// Axes helps
/* const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper) */

/**
 * Textures 材质
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/4.png') // 添加自己的材质 


/**
 * Fonts
 */
const fontLoader = new THREE.FontLoader()

fontLoader.load(
    // '/fonts/helvetiker_regular.typeface.json',
    // '/fonts/HarmonyOS Sans TC_Regular.json',
    '/fonts/FZShuSong-Z01S_Regular.json',


    (font) => {
        const textGeometry = new THREE.TextBufferGeometry(
            '时瑞', {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 12, // 曲线段
                bevelEnabled: true, // 斜面启用
                bevelThickness: 0.03, // 斜面厚度
                bevelSize: 0.02, // 斜面尺寸
                bevelOffset: 0, // 斜角偏移
                bevelSegments: 4 // 斜面段
            }
        )

        /*
          // 几何文本 边框尺寸
          textGeometry.computeBoundingBox();
          // 文本中心与坐标轴对齐（文本居中）
          textGeometry.translate(-(textGeometry.boundingBox.max.x - 0.02) * 0.5, -(textGeometry.boundingBox.max.y - 0.02) * 0.5, -(textGeometry.boundingBox.max.z - 0.03) * 0.5, )
        */
        // 文本中心与坐标轴对齐（文本居中）
        textGeometry.center()

        const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
        const text = new THREE.Mesh(textGeometry, textMaterial);
        scene.add(text)

        const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45)
        const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
        for (let i = 0; i < 200; i++) {


            const donut = new THREE.Mesh(donutGeometry, donutMaterial)

            donut.position.x = (Math.random() - 0.5) * 10
            donut.position.y = (Math.random() - 0.5) * 10
            donut.position.z = (Math.random() - 0.5) * 10

            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI

            const scale = Math.random()
            donut.scale.set(scale, scale, scale)

            scene.add(donut)
        }
    }
)





/**
 * Object
 */
/* const cube = new THREE.Mesh(
    new THREE.BoxBufferGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)

scene.add(cube) */

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
 * Camera 相机
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls 控制器
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer 渲染器
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate 动画
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