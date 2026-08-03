import * as THREE from 'three'

export function Cubo() {
  // --------------------------------------------------------------
  // CONFIGURACIÓN DE CARAS - IDs alineados con las secciones
  // --------------------------------------------------------------
  const CUBE_CONFIG = {
    faces: [
      {
        id: 'panorama',
        color: 0x99cc66,
        opacity: 0.8,
        label: '¿Qué son?',
        short_desc: 'Panorama general',
        full_desc:
        `<p>Es el documento elaborado por la SHCP en el que se presentan los aspectos más relevantes del marco macroeconómico y los objetivos de finanzas públicas para el cierre del año en curso y el siguiente ejercicio fiscal.</p>
    
    <p>Con este documento se inicia el diálogo con el Congreso de la Unión respecto del proceso presupuestario para el siguiente ejercicio fiscal, dando inicio a su correspondiente ciclo presupuestario. Se entrega, a más tardar el 1° de abril de cada año, al Congreso de la Unión y se publica en la página web de la SHCP para su consulta pública.</p>`,
        target_rotation: { x: 0, y: Math.PI / 2, z: 0 },
        localNormal: new THREE.Vector3(0, 0, 1),
        tooltip_main: '¿Qué son?',
        // Ejemplo de configuración para enlace externo (opcional)
        buttonAction: 'link',
        buttonUrl: 'https://www.finanzaspublicas.hacienda.gob.mx/work/models/Finanzas_Publicas/docs/paquete_economico/precgpe/precgpe_2027.pdf',
      },
      {
        id: 'ciclo-anterior',
        color: 0xfdd353,
        opacity: 0.8,
        label: '¿Qué paso el ciclo anterior?',
        short_desc: 'Panorama general',
        full_desc:
          'En 2025, la economía mexicana registró un crecimiento moderado de 1.1% debido a un efecto de arrastre negativo desde finales de 2024. A pesar de ello, hubo avances en el empleo, impulsados por cambios en subcontratación y plataformas digitales, aunque la participación laboral disminuyó. La recaudación aumentó gracias a medidas contra la evasión y ajustes regulatorios, destacando el crecimiento en impuestos a importaciones. La inflación se redujo por mejores condiciones climáticas y control en precios de energéticos, lo que permitió al Banco de México bajar su tasa de referencia; sin embargo, los ingresos petroleros mostraron menor dinamismo.',
        target_rotation: { x: 0, y: 2 * Math.PI, z: 0 },
        localNormal: new THREE.Vector3(1, 0, 0),
        tooltip_main: 'Ciclo anterior',
      },
      {
        id: 'estimaciones_2026',
        color: 0xd589dd,
        opacity: 0.8,
        label: '¿Cómo se prevé cerrar el año y cuál es el panorama para el siguiente?',
        short_desc: 'Panorama general',
        full_desc:
          'En 2026 continuará el proceso de normalización gradual del déficit, con el objetivo de preservar la solidez de las finanzas públicas y fortalecer la conducción responsable de la política fiscal. Bajo los principios de disciplina y responsabilidad hacendaria, al cierre del año los balances fiscales se mantendrán en línea con las metas aprobadas por el H. Congreso de la Unión',
        target_rotation: { x: 0, y: (3 * Math.PI) / 2, z: 0 },
        localNormal: new THREE.Vector3(0, 0, -1),
        tooltip_main: 'Estimaciones 2026',
      },
      {
        id: 'finanzas_publicas',
        color: 0x384e9e,
        opacity: 0.9,
        label: '¿De dónde vendrán los ingresos el próximo año y cómo se utilizarán?',
        short_desc: 'Panorama general',
        full_desc:
          'Para 2027, la mayoría de los ingresos provendrán del sector no petrolero gracias a una mayor eficiencia en la fiscalización y recaudación tributaria. Estos recursos compensarán la caída en los ingresos petroleros, afectados por la disminución proyectada del precio del petróleo. El presupuesto se utilizará principalmente para cubrir el gasto programable, buscando reducir el déficit fiscal al 3.0% del PIB',
        target_rotation: { x: 0, y: Math.PI, z: 0 },
        localNormal: new THREE.Vector3(-1, 0, 0),
        tooltip_main: 'Finanzas públicas',
      },
      {
        id: 'paquete_economico',
        color: 0x6abada,
        opacity: 0.85,
        label: '¿Cómo será el siguiente ciclo fiscal?',
        short_desc: 'Panorama general',
        full_desc:
          'En 2027 se llevará a cabo un proceso de normalización fiscal orientado a reducir el déficit público y garantizar la sostenibilidad de la deuda. La estrategia se basará en una gestión eficiente del gasto y una recaudación sólida, priorizando la inversión en infraestructura mediante planes estratégicos. Asimismo, se buscará fortalecer la economía interna impulsando el contenido nacional en las exportaciones y manteniendo una política de financiamiento de bajo riesgo, centrada en pasivos a largo plazo y moneda nacional para asegurar la estabilidad financiera del país.',
        target_rotation: { x: -Math.PI / 2, y: 0, z: -Math.PI / 2 },
        localNormal: new THREE.Vector3(0, 1, 0),
        tooltip_main: 'Impactos 2027',
      },
      {
        id: 'p_prioritarios',
        color: 0x33cccc,
        opacity: 0.8,
        label: '¿Qué proyectos se seguirán impulsando en 2027?',
        short_desc: 'Panorama general',
        full_desc:
          'En 2027 se seguirán impulsando medidas para mantener estables los precios de los combustibles, con el fin de evitar aumentos en el costo de vida y proteger el poder adquisitivo de las familias. Además, el país contará con mecanismos como fondos de estabilización, créditos internacionales y coberturas financieras, que permiten enfrentar riesgos externos y asegurar que el gobierno mantenga su capacidad para promover el desarrollo y garantizar el ejercicio efectivo de los derechos constitucionales a través de los Programas para el Bienestar.',
        target_rotation: { x: Math.PI / 2, y: 0, z: Math.PI / 2 },
        localNormal: new THREE.Vector3(0, -1, 0),
        tooltip_main: 'Programas prioritarios',
      },
    ],
    animation: { lerp_factor: 0.08 },
  }

  // Mapeo de normales locales a índices de material
  const normalToMatIdx = {
    '1,0,0': 0,
    '-1,0,0': 1,
    '0,1,0': 2,
    '0,-1,0': 3,
    '0,0,1': 4,
    '0,0,-1': 5,
  }
  const faceIdToMaterialIndex = {}
  CUBE_CONFIG.faces.forEach((face) => {
    const key = `${face.localNormal.x},${face.localNormal.y},${face.localNormal.z}`
    faceIdToMaterialIndex[face.id] = normalToMatIdx[key]
  })

  // --------------------------------------------------------------
  // SceneManager (cámara isométrica)
  // --------------------------------------------------------------
  class SceneManager {
    constructor(containerId) {
      this.container = document.getElementById(containerId)
      this.scene = new THREE.Scene()
      this.initCamera()
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
      this.renderer.setClearColor(0xffffff, 0)
      this.renderer.outputColorSpace = THREE.SRGBColorSpace
      this.renderer.toneMapping = THREE.LinearToneMapping
      this.renderer.toneMappingExposure = 1.2
      this.container.appendChild(this.renderer.domElement)
      this.setupLights()
      window.addEventListener('resize', () => this.onResize())
    }
    initCamera() {
      const aspect = this.container.clientWidth / this.container.clientHeight
      const size = 3.4
      this.camera = new THREE.OrthographicCamera(
        -size * aspect,
        size * aspect,
        size,
        -size,
        0.5,
        20,
      )
      this.camera.position.set(4.2, 3.2, 4.2)
      this.camera.lookAt(0, 0, 0)
      this.camera.up.set(0, 1, 0)
    }
    setupLights() {
      const ambient = new THREE.AmbientLight(0xffffff, 0.65)
      this.scene.add(ambient)
      const main = new THREE.DirectionalLight(0xffffff, 1.8)
      main.position.set(5, 8, 5)
      this.scene.add(main)
      const fill = new THREE.DirectionalLight(0xffffff, 1.0)
      fill.position.set(-3, -2, -3)
      this.scene.add(fill)
      const rim = new THREE.DirectionalLight(0xaaccff, 0.8)
      rim.position.set(-4, 5, -2)
      this.scene.add(rim)
    }
    onResize() {
      const width = this.container.clientWidth
      const height = this.container.clientHeight
      const aspect = width / height
      const size = 3.4
      this.camera.left = -size * aspect
      this.camera.right = size * aspect
      this.camera.top = size
      this.camera.bottom = -size
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(width, height)
    }
    render() {
      this.renderer.render(this.scene, this.camera)
    }
    getCamera() {
      return this.camera
    }
    getScene() {
      return this.scene
    }
  }

  // --------------------------------------------------------------
  // CubeController
  // --------------------------------------------------------------
  class CubeController {
    constructor(sceneManager, config) {
      this.sceneManager = sceneManager
      this.config = config
      this.cube = null
      this.targetRotation = { x: 0, y: 0, z: 0 }
      this.isAnimating = false
      this.originalColors = new Array(6)
      this.originalOpacities = new Array(6)
      this.init()
    }
    init() {
      this.createMaterials()
      const geometry = new THREE.BoxGeometry(2, 2, 2)
      this.cube = new THREE.Mesh(geometry, this.materials)
      this.sceneManager.getScene().add(this.cube)
    }
    createMaterials() {
      const mats = new Array(6)
      for (let i = 0; i < 6; i++) {
        mats[i] = new THREE.MeshStandardMaterial({
          color: 0x888888,
          transparent: true,
          opacity: 0.9,
          roughness: 0.3,
          metalness: 0.0,
          side: THREE.DoubleSide,
        })
      }
      this.config.faces.forEach((face) => {
        const idx = faceIdToMaterialIndex[face.id]
        if (idx !== undefined) {
          mats[idx] = new THREE.MeshStandardMaterial({
            color: face.color,
            emissive: face.color,
            emissiveIntensity: 0.25,
            transparent: true,
            opacity: face.opacity,
            roughness: 0.25,
            metalness: 0.0,
            side: THREE.DoubleSide,
          })
          this.originalColors[idx] = face.color
          this.originalOpacities[idx] = face.opacity
        }
      })
      for (let i = 0; i < 6; i++) {
        if (!this.originalColors[i]) this.originalColors[i] = 0x888888
      }
      this.materials = mats
    }
    rotateToFace(faceId) {
      const face = this.config.faces.find((f) => f.id === faceId)
      if (face) {
        this.targetRotation = { ...face.target_rotation }
        this.isAnimating = true
      }
    }
    highlightFace(faceId) {
      const targetMatIndex = faceIdToMaterialIndex[faceId]
      if (targetMatIndex === undefined) return
      for (let i = 0; i < this.materials.length; i++) {
        if (i === targetMatIndex) {
          this.materials[i].color.setHex(this.originalColors[i])
          this.materials[i].opacity = 0.95
        } else {
          this.materials[i].color.setHex(this.originalColors[i])
          this.materials[i].opacity = this.originalOpacities[i]
        }
      }
    }
    update() {
      if (this.isAnimating) {
        const lerp = (a, b, t) => a + (b - a) * t
        const f = this.config.animation.lerp_factor
        this.cube.rotation.x = lerp(this.cube.rotation.x, this.targetRotation.x, f)
        this.cube.rotation.y = lerp(this.cube.rotation.y, this.targetRotation.y, f)
        this.cube.rotation.z = lerp(this.cube.rotation.z, this.targetRotation.z, f)
        const eps = 0.002
        if (
          Math.abs(this.cube.rotation.x - this.targetRotation.x) < eps &&
          Math.abs(this.cube.rotation.y - this.targetRotation.y) < eps &&
          Math.abs(this.cube.rotation.z - this.targetRotation.z) < eps
        ) {
          this.cube.rotation.x = this.targetRotation.x
          this.cube.rotation.y = this.targetRotation.y
          this.cube.rotation.z = this.targetRotation.z
          this.isAnimating = false
        }
      }
    }
    getCube() {
      return this.cube
    }
    getFaceIdFromIntersection(matIndex) {
      for (let [id, idx] of Object.entries(faceIdToMaterialIndex)) {
        if (idx === matIndex) return id
      }
      return null
    }
    rotateTo(rotation) {
      this.targetRotation = { ...rotation }
      this.isAnimating = true
    }
  }

  // --------------------------------------------------------------
  // UIManager (con botón configurable)
  // --------------------------------------------------------------
  class UIManager {
    constructor(config, onTooltipClickCallback) {
      this.config = config
      this.tooltips = []
      this.panelTitle = document.getElementById('panel-title')
      /* this.panelTagline = document.getElementById('panel-tagline') */
      this.panelDesc = document.getElementById('panel-description')
      this.verMasBtn = document.getElementById('verMasBtn')
      this.container = document.getElementById('tooltips-container')
      this.canvasContainer = document.getElementById('canvas-container')
      this.onTooltipClick = onTooltipClickCallback
      this.initTooltips()

      // Manejador del botón (no cambia)
      this.verMasBtn.addEventListener('click', () => {
        const activeFace = this.currentFace || this.config.faces[0]
        const action = activeFace.buttonAction || 'scroll'
        if (action === 'link' && activeFace.buttonUrl) {
          window.open(activeFace.buttonUrl, '_blank')
        } else {
          const element = document.getElementById(activeFace.id)
          if (element) {
            const offset = 100
            const bodyRect = document.body.getBoundingClientRect().top
            const elementRect = element.getBoundingClientRect().top
            const offsetPosition = elementRect - bodyRect - offset
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
          }
        }
      })

      this.currentFace = this.config.faces[0]
      this.updatePanel(this.currentFace)
    }
    initTooltips() {
      this.config.faces.forEach((face) => {
        const div = document.createElement('div')
        div.className = `face-tooltip ${face.id} no-seleccionado`
        div.dataset.faceId = face.id
        div.innerHTML = `<span class="tooltip-title">${face.tooltip_main}</span>`
        div.addEventListener('click', (e) => {
          e.stopPropagation()
          if (this.onTooltipClick) {
            this.onTooltipClick(face.id)
          }
        })
        this.container.appendChild(div)
        this.tooltips.push({
          element: div,
          faceId: face.id,
          localNormal: face.localNormal.clone(),
        })
      })
    }
    getFaceWorldPosition(cube, localNormal) {
      return localNormal.clone().multiplyScalar(1.0).applyMatrix4(cube.matrixWorld)
    }
    updateTooltips(camera, cube, hide) {
      if (hide) {
        this.tooltips.forEach((t) => t.element.classList.add('hidden'))
        return
      }
      const canvasRect = this.canvasContainer.getBoundingClientRect()
      const isMobile = window.innerWidth < 1000
      this.tooltips.forEach((tool) => {
        const face = this.config.faces.find((f) => f.id === tool.faceId)
        if (!face) return
        const worldPos = this.getFaceWorldPosition(cube, face.localNormal)
        const vec = worldPos.clone().project(camera)
        const visible = vec.z <= 1 && vec.z >= -1
        if (visible) {
          const centerX = canvasRect.left + canvasRect.width / 2
          const centerY = canvasRect.top + canvasRect.height / 2
          const x = centerX + vec.x * canvasRect.width * 2
          const y = centerY - vec.y * canvasRect.height * 1.5
          tool.element.style.left = `${x}px`
          tool.element.style.top = `${y - (isMobile ? 32 : 42)}px`
          tool.element.style.transform = 'translateX(-50%)'
          tool.element.classList.remove('hidden')
        } else {
          tool.element.classList.add('hidden')
        }
      })
    }
    setActiveTooltip(faceId) {
      this.tooltips.forEach((t) => {
        if (t.faceId === faceId) {
          t.element.classList.remove('no-seleccionado')
        } else {
          t.element.classList.add('no-seleccionado')
        }
      })
    }
   updatePanel(face) {
      this.currentFace = face
      this.setActiveTooltip(face.id)

      this.panelTitle.textContent = face.label
      this.panelTitle.style.borderLeft = `10px solid ${'#' + face.color.toString(16).padStart(6, '0')}`
      /* this.panelTagline.innerHTML = face.short_desc ? `${face.short_desc}` : 'Información clave' */
      /* this.panelDesc.textContent = face.full_desc */
      this.panelDesc.innerHTML = face.full_desc

      // ----- NUEVO: texto dinámico del botón -----
      if (face.buttonText) {
        this.verMasBtn.textContent = face.buttonText
      } else {
        const action = face.buttonAction || 'scroll'
        this.verMasBtn.querySelector('.text').textContent =
  action === 'link' ? 'Abrir enlace' : 'Ver más';
      }
    }
  }

  // --------------------------------------------------------------
  // ScrollManager (detecta sección visible)
  // --------------------------------------------------------------
  class ScrollManager {
    constructor(onSectionChange) {
      this.sections = document.querySelectorAll('.cubo-track')
      this.currentSection = null
      this.onSectionChange = onSectionChange
      this.initObserver()
      this.initScrollMode()
    }
    initObserver() {
      const observer = new IntersectionObserver(
        (entries) => {
          let best = null
          let maxRatio = 0
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
              maxRatio = entry.intersectionRatio
              best = entry.target
            }
          })
          if (best) {
            const faceId = best.dataset.faceId
            if (faceId && faceId !== this.currentSection) {
              this.currentSection = faceId
              this.onSectionChange(faceId)
            }
          }
        },
        { threshold: 0.4 },
      )
      this.sections.forEach((s) => observer.observe(s))
    }
    initScrollMode() {
      const cubo = document.getElementById('canvas-container')
      const calcularPosicion = () => {
        const logo = document.querySelector('#logo')
        const position = logo.getBoundingClientRect()
        if (window.scrollY > 80) {
          cubo.style.top = `${position.top - 28}px`
          cubo.style.left = `${position.left - 28}px`
        }
      }
      window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
          calcularPosicion()
          document.body.classList.add('scroll-mode')
        } else {
          document.body.classList.remove('scroll-mode')
          cubo.style.top = `0px`
          cubo.style.left = `0px`
        }
      })
      window.addEventListener('resize', calcularPosicion)
      if (window.scrollY > 80) document.body.classList.add('scroll-mode')
    }
  }

  // --------------------------------------------------------------
  // EventManager (clics en el cubo)
  // --------------------------------------------------------------
  class EventManager {
    constructor(sceneManager, cubeController, onCubeClick) {
      this.sceneManager = sceneManager
      this.cubeController = cubeController
      this.onCubeClick = onCubeClick
      this.raycaster = new THREE.Raycaster()
      this.mouse = new THREE.Vector2()
      this.canvas = this.sceneManager.renderer.domElement
      this.canvas.addEventListener('click', (e) => this.onClick(e))
      this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e))
      this.canvas.addEventListener(
        'touchstart',
        (e) => {
          e.preventDefault()
          const touch = e.touches[0]
          const mouseEvent = new MouseEvent('click', {
            clientX: touch.clientX,
            clientY: touch.clientY,
          })
          this.canvas.dispatchEvent(mouseEvent)
        },
        { passive: false },
      )
    }
    onClick(event) {
      const rect = this.canvas.getBoundingClientRect()
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      this.raycaster.setFromCamera(this.mouse, this.sceneManager.getCamera())
      const intersects = this.raycaster.intersectObject(this.cubeController.getCube())
      if (intersects.length > 0) {
        const matIdx = intersects[0].face.materialIndex
        const faceId = this.cubeController.getFaceIdFromIntersection(matIdx)
        if (faceId && this.onCubeClick) this.onCubeClick(faceId)
      }
    }
    onMouseMove(event) {
      const rect = this.canvas.getBoundingClientRect()
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      this.raycaster.setFromCamera(this.mouse, this.sceneManager.getCamera())
      const intersects = this.raycaster.intersectObject(this.cubeController.getCube())
      this.canvas.style.cursor = intersects.length > 0 ? 'pointer' : 'grab'
    }
  }

  // --------------------------------------------------------------
  // Aplicación principal
  // --------------------------------------------------------------
  class CubeNavigator {
    constructor() {
      this.sceneManager = new SceneManager('canvas-container')
      this.cubeController = new CubeController(this.sceneManager, CUBE_CONFIG)
      this.selectFace = (faceId) => {
        const face = CUBE_CONFIG.faces.find((f) => f.id === faceId)
        if (!face) return
        this.originalRotation = {
          x: face.target_rotation.x,
          y: face.target_rotation.y,
          z: face.target_rotation.z,
        }
        this.cubeController.rotateToFace(faceId)
        this.cubeController.highlightFace(faceId)
        this.uiManager.updatePanel(face)
      }
      this.uiManager = new UIManager(CUBE_CONFIG, (faceId) => this.selectFace(faceId))
      this.eventManager = new EventManager(this.sceneManager, this.cubeController, (faceId) =>
        this.selectFace(faceId),
      )
      this.scrollManager = new ScrollManager((faceId) => this.selectFace(faceId))
      this.isIdle = false
      this.idleTimeout = null
      this.IDLE_TIME = 600000
      this.idleRotationSpeed = 0.005
      this.returningFromIdle = false
      this.targetRotation = null
      this.returnSpeed = 0.08
      this.originalRotation = { x: 0, y: 0, z: 0 }
      const defaultFaceId = 'panorama'
      this.cubeController.rotateToFace(defaultFaceId)
      this.cubeController.highlightFace(defaultFaceId)
      const defaultFace = CUBE_CONFIG.faces.find((f) => f.id === defaultFaceId)
      if (defaultFace) {
        this.uiManager.updatePanel(defaultFace)
        this.uiManager.setActiveTooltip(defaultFaceId)
        this.originalRotation = {
          x: defaultFace.target_rotation.x,
          y: defaultFace.target_rotation.y,
          z: defaultFace.target_rotation.z,
        }
      }
      this.setupIdleDetection()
      this.animate()
      this.createBackToTopButton();   // NUEVO
      this.setupBackToTopButton();    // NUEVO
    }
    // NUEVO: Crea el botón flotante "Volver arriba"
    createBackToTopButton() {
      // Evitar duplicados
      if (document.getElementById('back-to-top')) return;

      const btn = document.createElement('button');
      btn.id = 'back-to-top';
      btn.innerHTML = '↑';
      btn.setAttribute('aria-label', 'Volver arriba');
      btn.setAttribute('title', 'Volver arriba');

      // Estilos básicos (puedes personalizarlos o moverlos a CSS)
      btn.style.position = 'fixed';
      btn.style.bottom = '30px';
      btn.style.right = '30px';
      btn.style.width = '50px';
      btn.style.height = '50px';
      btn.style.borderRadius = '50%';
      btn.style.backgroundColor = '#3b82f6';
      btn.style.color = 'white';
      btn.style.border = 'none';
      btn.style.fontSize = '28px';
      btn.style.fontWeight = 'bold';
      btn.style.cursor = 'pointer';
      btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
      btn.style.transition = 'opacity 0.3s, visibility 0.3s, transform 0.2s';
      btn.style.opacity = '0';
      btn.style.visibility = 'hidden';
      btn.style.zIndex = '1000';
      btn.style.display = 'flex';
      btn.style.alignItems = 'center';
      btn.style.justifyContent = 'center';

      // Efecto hover
      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'scale(1.05)';
        btn.style.backgroundColor = '#1e40af';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'scale(1)';
        btn.style.backgroundColor = '#3b82f6';
      });

      document.body.appendChild(btn);
    }

    // NUEVO: Controla la visibilidad del botón según el scroll
    setupBackToTopButton() {
      const btn = document.getElementById('back-to-top');
      if (!btn) return;

      const toggleVisibility = () => {
        if (window.scrollY > 300) {
          btn.style.opacity = '1';
          btn.style.visibility = 'visible';
        } else {
          btn.style.opacity = '0';
          btn.style.visibility = 'hidden';
        }
      };

      window.addEventListener('scroll', toggleVisibility);
      toggleVisibility();

      btn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }

    animate() {
      requestAnimationFrame(() => this.animate())
      const cube = this.cubeController.getCube()
      if (this.isIdle) {
        cube.rotation.y += this.idleRotationSpeed
        cube.rotation.x += this.idleRotationSpeed * 0.3
      } else if (this.returningFromIdle) {
        cube.rotation.x += (this.targetRotation.x - cube.rotation.x) * this.returnSpeed
        cube.rotation.y += (this.targetRotation.y - cube.rotation.y) * this.returnSpeed
        cube.rotation.z += (this.targetRotation.z - cube.rotation.z) * this.returnSpeed
        const diffX = Math.abs(cube.rotation.x - this.targetRotation.x)
        const diffY = Math.abs(cube.rotation.y - this.targetRotation.y)
        const diffZ = Math.abs(cube.rotation.z - this.targetRotation.z)
        if (diffX < 0.001 && diffY < 0.001 && diffZ < 0.001) {
          cube.rotation.x = this.targetRotation.x
          cube.rotation.y = this.targetRotation.y
          cube.rotation.z = this.targetRotation.z
          this.returningFromIdle = false
        }
      } else {
        this.cubeController.update()
      }
      const hideTooltips = document.body.classList.contains('scroll-mode')
      this.uiManager.updateTooltips(
        this.sceneManager.getCamera(),
        this.cubeController.getCube(),
        hideTooltips,
      )
      this.sceneManager.render()
    }
    setupIdleDetection() {
      const resetIdleTimer = () => {
        clearTimeout(this.idleTimeout)
        if (this.isIdle) {
          this.isIdle = false
          this.returningFromIdle = true
          this.targetRotation = { ...this.originalRotation }
        }
        this.idleTimeout = setTimeout(() => {
          this.isIdle = true
          this.returningFromIdle = false
        }, this.IDLE_TIME)
      }
      const events = ['mousemove', 'mousedown', 'click', 'scroll', 'touchstart', 'keydown', 'wheel']
      events.forEach((event) => {
        window.addEventListener(event, resetIdleTimer, { passive: true })
      })
      resetIdleTimer()
    }
  }

  new CubeNavigator()
}