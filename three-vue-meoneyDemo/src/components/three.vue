<template>
  <div ref="container" class="bill-container"></div>
  <button
    @click="addBill"
    style="position: absolute; top: 20px; left: 20px; z-index: 10"
  >
    添加纸币
  </button>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as CANNON from "cannon-es";

export default {
  name: "MoneyBill",
  data() {
    return {
      animationId: null,
      bills: [], // 所有纸币的 mesh
      billBodies: [], // 所有纸币的刚体
      textureLoader: null,
      frontTexture: null,
      backTexture: null,
      raycaster: null,
      mouse: null,
    };
  },
  mounted() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.world = null;
    this.textureLoader = new THREE.TextureLoader();
    this.frontTexture = this.textureLoader.load("/front.png");
    this.backTexture = this.textureLoader.load("/back.png");
    this.initPhysics();
    this.initThreeJS();
    this.animate();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    window.addEventListener("resize", this.handleResize);
    this.$refs.container.addEventListener("mousemove", this.onMouseMove);
  },
  beforeUnmount() {
    this.$refs.container.removeEventListener("mousemove", this.onMouseMove);
  },
  methods: {
    initThreeJS() {
      this.scene = new THREE.Scene();
      const container = this.$refs.container;
      this.camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      );
      this.camera.position.z = 2;
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement);
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      this.scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(1, 1, 1);
      this.scene.add(directionalLight);
    },
    initPhysics() {
      this.world = new CANNON.World({
        gravity: new CANNON.Vec3(0, -9.82, 0),
      });
      // 地面
      const groundBody = new CANNON.Body({
        mass: 0,
        shape: new CANNON.Plane(),
      });
      // 让地面朝上
      groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
      groundBody.position.set(0, -0.5, 0); // 控制纸币堆积的高度
      this.world.addBody(groundBody);
    },
    addBill() {
      // three.js mesh
      const frontMaterial = new THREE.MeshBasicMaterial({
        map: this.frontTexture,
        side: THREE.FrontSide,
        transparent: true,
      });
      const frontMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1.55, 0.77),
        frontMaterial
      );
      const backMaterial = new THREE.MeshBasicMaterial({
        map: this.backTexture,
        side: THREE.FrontSide,
        transparent: true,
      });
      const backMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1.55, 0.77),
        backMaterial
      );
      backMesh.rotateY(Math.PI);
      const billGroup = new THREE.Group();
      billGroup.add(frontMesh);
      billGroup.add(backMesh);
      billGroup.scale.set(0.2, 0.2, 0.2);
      this.scene.add(billGroup);

      // 物理刚体
      const shape = new CANNON.Box(
        new CANNON.Vec3(1.55 * 0.1, 0.77 * 0.1, 0.01)
      );
      // 随机x/z初始位置，避免完全重叠
      const x = (Math.random() - 0.5) * 0.5;
      const z = (Math.random() - 0.5) * 0.5;
      const billBody = new CANNON.Body({
        mass: 1,
        shape: shape,
        position: new CANNON.Vec3(x, 1.5, z),
      });
      this.world.addBody(billBody);

      this.bills.push(billGroup);
      this.billBodies.push(billBody);
    },
    animate() {
      this.animationId = requestAnimationFrame(this.animate);

      if (this.world && this.billBodies.length) {
        this.world.step(1 / 60);
        // 同步所有纸币
        for (let i = 0; i < this.bills.length; i++) {
          this.bills[i].position.copy(this.billBodies[i].position);
          this.bills[i].quaternion.copy(this.billBodies[i].quaternion);
        }
      }
      if (this.controls) this.controls.update();
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    },
    handleResize() {
      const container = this.$refs.container;
      if (this.camera && this.renderer && container) {
        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
      }
    },
    onMouseMove(event) {
      const container = this.$refs.container;
      const rect = container.getBoundingClientRect();
      // 归一化鼠标坐标
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      // 检测所有纸币
      const intersects = this.raycaster.intersectObjects(this.bills, true);
      if (intersects.length > 0) {
        // 找到第一个被鼠标悬停的纸币
        const mesh = intersects[0].object.parent; // 因为billGroup
        const idx = this.bills.findIndex((b) => b === mesh);
        if (idx !== -1) {
          // 给物理刚体一个横向风力
          const body = this.billBodies[idx];
          // 施加一个向右的力（你可以调整数值和方向）
          body.applyForce(new CANNON.Vec3(2, 0, 0), body.position);
        }
      }
    },
  },
};
</script>

<style scoped>
.bill-container {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
}
button {
  font-size: 18px;
  padding: 8px 20px;
}
</style>
