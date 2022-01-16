import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  DirectionalLight,
  HemisphereLight,
  sRGBEncoding,
  Object3D,
  AnimationClip,
  AnimationMixer,
} from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';

export class Renderer {
  private scene = new Scene();
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  private frameId: number | null = null;
  private cameraAngle: number = Math.PI;
  private resizeObserver = new ResizeObserver(this.handleResize.bind(this));
  private armature: Object3D | null = null;
  private mixer: AnimationMixer | null = null;
  private time: number | undefined = undefined;

  constructor(private mount: HTMLElement) {
    this.animate = this.animate.bind(this);
    this.handleWheel = this.handleWheel.bind(this);

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // Setup camera
    this.camera = new PerspectiveCamera(40, width / height, 0.1, 100);
    this.updateCameraPosition();

    // Setup renderer
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.renderer.setClearColor('#202030');
    this.renderer.outputEncoding = sRGBEncoding;
    this.mount.appendChild(this.renderer.domElement);

    // Populate scene
    this.addLights();

    // Setup window resize callback.
    this.renderer.domElement.addEventListener('wheel', this.handleWheel);
    this.resizeObserver.observe(this.mount);
    this.sceneChanged();
  }

  public dispose() {
    this.stop();
    this.resizeObserver.unobserve(this.mount);
    this.renderer.domElement.removeEventListener('wheel', this.handleWheel);
    this.mount.removeChild(this.renderer.domElement);
  }

  public display(
    skin: Object3D | undefined,
    armature: Object3D | null,
    clip: AnimationClip | undefined
  ) {
    if (this.armature) {
      this.armature.parent?.remove(this.armature);
    }
    if (skin && armature) {
      const saveParent = skin.parent;
      armature.add(skin);
      this.armature = (SkeletonUtils as any).clone(armature);
      armature.remove(skin);
      saveParent?.add(skin);
      this.scene.add(this.armature!);
      this.mixer = new AnimationMixer(this.armature!);
      if (clip) {
        const action = this.mixer.clipAction(clip);
        action.play();
      }
    }
    this.sceneChanged();
  }

  private addLights() {
    // Ambient light
    const skyColor = 0xb1e1ff; // light blue
    const groundColor = 0xb97a20; // brownish orange
    const intensity = 0.5;
    const hLight = new HemisphereLight(skyColor, groundColor, intensity);
    this.scene.add(hLight);

    // Directional light
    const sunlight = new DirectionalLight('#ffffff', 0.5);
    sunlight.position.set(5, 7, -4);
    sunlight.target.position.set(0, 0, 0);
    this.scene.add(sunlight);
    this.scene.add(sunlight.target);
  }

  private animate(time: number) {
    const delta = this.time === undefined ? 0 : (time - this.time) / 1000;
    this.time = time;
    if (this.mixer) {
      this.mixer.update(delta);
    }
    this.render();
    this.frameId = window.requestAnimationFrame(this.animate);
  }

  private render() {
    this.updateCameraPosition();
    this.renderer.render(this.scene, this.camera);
  }

  private sceneChanged() {
    if (!this.frameId) {
      this.frameId = window.requestAnimationFrame(this.animate);
    }
  }

  private stop() {
    window.cancelAnimationFrame(this.frameId!);
    this.frameId = null;
  }

  private updateCameraPosition() {
    this.camera.position.z = Math.sin(this.cameraAngle) * 3;
    this.camera.position.y = 3;
    this.camera.position.x = Math.cos(this.cameraAngle) * 3;
    this.camera.lookAt(0, 1, 0);
  }

  private handleResize() {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.render();
  }

  private handleWheel(e: WheelEvent) {
    this.cameraAngle -= e.deltaX / 200;
    this.cameraAngle = this.cameraAngle % (Math.PI * 2);
    this.sceneChanged();
  }
}
