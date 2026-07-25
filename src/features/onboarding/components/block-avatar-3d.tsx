"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  AvatarAccessoryId,
  AvatarBaseId,
  AvatarBodyId,
  AvatarHeightId,
} from "../data/onboarding-dummy-data";

type BlockAvatar3DProps = {
  accessory: AvatarAccessoryId;
  base: AvatarBaseId;
  body: AvatarBodyId;
  color: string;
  height: AvatarHeightId;
  shadow: string;
  skinTone: string;
};

export function BlockAvatar3D({
  accessory,
  base,
  body: bodyType,
  color,
  height,
  shadow,
  skinTone,
}: BlockAvatar3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const host = mount;

    let frameId = 0;
    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setFailed(true);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 1.4, 7.2);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    host.appendChild(renderer.domElement);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(4, 6, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);
    scene.add(new THREE.HemisphereLight(0xf8fafc, 0x172033, 2.2));

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(2.25, 48),
      new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.8;
    floor.receiveShadow = true;
    scene.add(floor);

    const avatar = new THREE.Group();
    scene.add(avatar);

    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      roughness: 0.48,
      metalness: 0.04,
    });
    const shadowMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(shadow),
      roughness: 0.6,
    });
    const skinMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(skinTone),
      roughness: 0.5,
      metalness: 0.02,
    });
    const whiteMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.46 });
    const inkMaterial = new THREE.MeshStandardMaterial({ color: 0x172033, roughness: 0.5 });
    const amberMaterial = new THREE.MeshStandardMaterial({ color: 0xf9c74f, roughness: 0.42 });
    const blueMaterial = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.42 });
    const blackMaterial = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.55 });

    function roundedBox(width: number, height: number, depth: number, material: THREE.Material) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    }

    const heightScale = height === "pendek" ? 0.9 : height === "tinggi" ? 1.1 : 1;
    const bodyScale = bodyType === "slim" ? 0.86 : bodyType === "strong" ? 1.12 : 1;
    avatar.scale.set(bodyScale, heightScale, bodyScale);

    const head = roundedBox(base === "robot" ? 1.6 : 1.75, 1.45, 1.35, skinMaterial);
    head.position.y = 1.15;
    avatar.add(head);

    const body = roundedBox(1.95, 1.45, 1.05, bodyMaterial);
    body.position.y = -0.15;
    avatar.add(body);

    const belt = roundedBox(2.04, 0.16, 1.12, shadowMaterial);
    belt.position.y = -0.72;
    avatar.add(belt);

    const leftArm = roundedBox(0.34, 1.1, 0.34, skinMaterial);
    leftArm.position.set(-1.28, -0.05, 0);
    leftArm.rotation.z = -0.18;
    avatar.add(leftArm);

    const rightArm = roundedBox(0.34, 1.1, 0.34, skinMaterial);
    rightArm.position.set(1.28, -0.05, 0);
    rightArm.rotation.z = 0.18;
    avatar.add(rightArm);

    const leftLeg = roundedBox(0.44, 0.9, 0.44, skinMaterial);
    leftLeg.position.set(-0.48, -1.35, 0);
    avatar.add(leftLeg);

    const rightLeg = roundedBox(0.44, 0.9, 0.44, skinMaterial);
    rightLeg.position.set(0.48, -1.35, 0);
    avatar.add(rightLeg);

    const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.18, 24, 16), inkMaterial);
    leftEye.position.set(-0.36, 1.24, 0.7);
    avatar.add(leftEye);

    const rightEye = leftEye.clone();
    rightEye.position.x = 0.36;
    avatar.add(rightEye);

    const smile = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.035, 12, 32, Math.PI), whiteMaterial);
    smile.position.set(0, 0.88, 0.72);
    smile.rotation.z = Math.PI;
    avatar.add(smile);

    if (base === "detektif") {
      const brim = roundedBox(2.05, 0.16, 1.5, blackMaterial);
      brim.position.set(0, 1.92, 0);
      avatar.add(brim);
      const crown = roundedBox(1.35, 0.48, 1.06, blackMaterial);
      crown.position.set(0, 2.2, 0);
      avatar.add(crown);
    }

    if (base === "buku") {
      const pages = roundedBox(1.42, 0.22, 1.24, whiteMaterial);
      pages.position.set(0, 1.95, 0);
      avatar.add(pages);
    }

    if (base === "kompas") {
      const compass = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.12, 36), amberMaterial);
      compass.position.set(0.63, 1.9, 0.2);
      compass.rotation.x = Math.PI / 2;
      compass.castShadow = true;
      avatar.add(compass);
    }

    if (base === "robot") {
      const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.42, 12), inkMaterial);
      antenna.position.set(0, 2.04, 0);
      avatar.add(antenna);
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), amberMaterial);
      dot.position.set(0, 2.3, 0);
      avatar.add(dot);
    }

    if (base === "dokter") {
      const cap = roundedBox(1.0, 0.35, 1.0, whiteMaterial);
      cap.position.set(0, 1.98, 0);
      avatar.add(cap);
      const plusV = roundedBox(0.12, 0.34, 0.08, new THREE.MeshStandardMaterial({ color: 0xef4444 }));
      plusV.position.set(0, 2.0, 0.55);
      avatar.add(plusV);
      const plusH = roundedBox(0.34, 0.12, 0.08, plusV.material);
      plusH.position.set(0, 2.0, 0.56);
      avatar.add(plusH);
    }

    if (base === "arsitek") {
      for (let i = 0; i < 6; i += 1) {
        const block = roundedBox(0.26, 0.18, 0.08, whiteMaterial);
        block.position.set(-0.45 + (i % 3) * 0.45, -0.18 + Math.floor(i / 3) * 0.28, 0.57);
        avatar.add(block);
      }
    }

    if (accessory === "lens") {
      const lens = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.055, 16, 48), amberMaterial);
      lens.position.set(0.82, 1.2, 0.83);
      lens.castShadow = true;
      avatar.add(lens);
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.62, 12), amberMaterial);
      handle.position.set(1.12, 0.82, 0.82);
      handle.rotation.z = -0.72;
      handle.castShadow = true;
      avatar.add(handle);
    }

    if (accessory === "cap") {
      const cap = roundedBox(1.52, 0.38, 1.12, blueMaterial);
      cap.position.set(0, 2.05, 0);
      avatar.add(cap);
      const brim = roundedBox(1.9, 0.12, 1.25, blueMaterial);
      brim.position.set(0, 1.82, 0.2);
      avatar.add(brim);
    }

    if (accessory === "spark") {
      const spark = new THREE.Mesh(new THREE.OctahedronGeometry(0.28), amberMaterial);
      spark.position.set(1.25, 2.05, 0.2);
      spark.castShadow = true;
      avatar.add(spark);
    }

    if (accessory === "badge") {
      const badge = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.08, 36), amberMaterial);
      badge.position.set(0.62, -0.08, 0.58);
      badge.rotation.x = Math.PI / 2;
      badge.castShadow = true;
      avatar.add(badge);
    }

    if (accessory === "backpack") {
      const pack = roundedBox(0.56, 1.05, 0.36, blueMaterial);
      pack.position.set(-1.08, -0.18, -0.25);
      avatar.add(pack);
    }

    function resize() {
      const width = host.clientWidth || 320;
      const height = host.clientHeight || 320;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    const clock = new THREE.Clock();
    function animate() {
      const elapsed = clock.getElapsedTime();
      avatar.rotation.y = Math.sin(elapsed * 0.65) * 0.34;
      avatar.position.y = Math.sin(elapsed * 1.4) * 0.08;
      leftArm.rotation.z = -0.24 + Math.sin(elapsed * 1.8) * 0.12;
      rightArm.rotation.z = 0.24 - Math.sin(elapsed * 1.8) * 0.12;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      renderer.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      renderer.domElement.remove();
    };
  }, [accessory, base, bodyType, color, height, shadow, skinTone]);

  if (failed) {
    return (
      <div className="grid h-full min-h-80 place-items-center rounded-[8px] bg-white/10 text-center text-sm font-bold text-white/80">
        Preview 3D tidak tersedia di perangkat ini.
      </div>
    );
  }

  return <div className="h-full min-h-80 w-full" ref={mountRef} />;
}
