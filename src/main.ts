import {
  WebGLRenderer, PerspectiveCamera, Scene, BoxGeometry, MeshPhongMaterial, Mesh, DirectionalLight,
} from 'three';

const width = window.innerWidth;
const height = window.innerHeight;

const renderer = new WebGLRenderer({
  canvas: document.getElementById('app') as HTMLCanvasElement,
});
renderer.setSize(width, height);

const mainCamera = new PerspectiveCamera(60, width / height, 0.1, 1000);

const scene = new Scene();

const geometry = new BoxGeometry();
const material = new MeshPhongMaterial({ color: 0x0000ff });
const cube = new Mesh(geometry, material);
cube.position.set(0, 0, -5);

scene.add(cube);

const rotateCube = () => {
  cube.rotation.y -= 0.03;
  cube.rotation.z -= 0.01;
};
const light = new DirectionalLight(0xFFFFFF, 1);
light.position.set(0, 0, 2);
scene.add(light);

const render = () => {
  rotateCube();
  renderer.render(scene, mainCamera);
  requestAnimationFrame(render);
};
render();
