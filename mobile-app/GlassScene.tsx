import { useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Canvas, useFrame, useThree } from '@react-three/fiber/native';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const FILL_Y_MIN = 0.0821;
const FILL_Y_MAX = 0.1375;

async function loadGLB(): Promise<THREE.Group> {
  const asset = Asset.fromModule(require('./assets/cocktail-glass.glb'));
  await asset.downloadAsync();
  const uri = asset.localUri ?? asset.uri;
  if (!uri) throw new Error('No asset URI after download');

  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const binary = atob(base64);
  const bytes  = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

  const loader = new GLTFLoader();
  return new Promise((resolve, reject) =>
    loader.parse(bytes.buffer, '', (gltf) => resolve(gltf.scene as THREE.Group), reject),
  );
}

interface ModelProps {
  fillTarget: number;
  color:      string;
}

function GlassModel({ fillTarget, color }: ModelProps) {
  const [model, setModel]  = useState<THREE.Group | null>(null);
  const { camera, scene }  = useThree();

  const fillRef        = useRef(0);
  const targetFillRef  = useRef(fillTarget);
  const targetColorRef = useRef(new THREE.Color(color));
  const clipPlane      = useRef(new THREE.Plane(new THREE.Vector3(0, -1, 0), FILL_Y_MIN));
  const cocktailMat    = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const waveMat        = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const waveMesh       = useRef<THREE.Mesh | null>(null);

  useEffect(() => { targetFillRef.current  = fillTarget; },          [fillTarget]);
  useEffect(() => { targetColorRef.current = new THREE.Color(color); }, [color]);

  useEffect(() => {
    loadGLB()
      .then((root) => {
        root.traverse((node) => {
          if (!(node instanceof THREE.Mesh)) return;
          const matName = (node.material as THREE.Material)?.name ?? '';

          if (matName === 'glass') {
            node.renderOrder = 2;
            node.material    = new THREE.MeshPhysicalMaterial({
              color:       new THREE.Color(0.80, 0.92, 0.98),
              opacity:     0.35,
              transparent: true,
              roughness:   0.03,
              metalness:   0.05,
              side:        THREE.DoubleSide,
              depthWrite:  false,
            });
          }

          if (matName === 'cocktail') {
            node.renderOrder  = 1;
            cocktailMat.current = new THREE.MeshPhysicalMaterial({
              color:          new THREE.Color(color),
              opacity:        0.90,
              transparent:    true,
              roughness:      0.05,
              metalness:      0.04,
              side:           THREE.DoubleSide,
              depthWrite:     false,
              clippingPlanes: [clipPlane.current],
            });
            node.material = cocktailMat.current;

            const waveGeom = new THREE.PlaneGeometry(0.09, 0.09, 28, 28);
            waveGeom.rotateX(-Math.PI / 2);
            waveMat.current  = new THREE.MeshPhysicalMaterial({
              color:       new THREE.Color(color),
              opacity:     0.75,
              transparent: true,
              roughness:   0.0,
              metalness:   0.2,
              side:        THREE.DoubleSide,
              depthWrite:  false,
            });
            waveMesh.current = new THREE.Mesh(waveGeom, waveMat.current);
            waveMesh.current.renderOrder = 1;
            waveMesh.current.visible     = false;
            root.add(waveMesh.current);
          }

          if (['pick', 'olive', 'pimento'].includes(matName)) node.visible = false;
        });

        // Auto-frame camera
        const box    = new THREE.Box3().setFromObject(root);
        const center = box.getCenter(new THREE.Vector3());
        const size   = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const cam    = camera as THREE.PerspectiveCamera;
        const fovRad = cam.fov * (Math.PI / 180);
        const dist   = (maxDim / 2) / Math.tan(fovRad / 2) * 2.0;

        cam.position.set(center.x, center.y + size.y * 0.08, center.z + dist);
        cam.lookAt(center.x, center.y - size.y * 0.05, center.z);
        cam.near = dist * 0.01;
        cam.far  = dist * 10;
        cam.updateProjectionMatrix();

        setModel(root);
      })
      .catch((err) => console.error('[GlassScene] load failed:', err));
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (model) model.rotation.y = Math.sin(t * 0.18) * 0.14;

    const delta = targetFillRef.current - fillRef.current;
    fillRef.current += delta * (delta > 0 ? 0.014 : 0.06);

    const fillY = FILL_Y_MIN + fillRef.current * (FILL_Y_MAX - FILL_Y_MIN);
    clipPlane.current.constant = fillY;

    const wm  = waveMesh.current;
    const wmt = waveMat.current;
    const cm  = cocktailMat.current;

    if (wm && wmt && cm) {
      wm.visible = fillRef.current > 0.02;
      if (wm.visible) {
        wm.position.y = fillY;
        const pos = wm.geometry.attributes.position as THREE.BufferAttribute;
        const amp = 0.002 * (1 - fillRef.current * 0.55);
        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i), z = pos.getZ(i);
          pos.setY(i,
            amp * Math.sin(t * 3.4 + x * 52) +
            amp * 0.55 * Math.sin(t * 2.2 + z * 40 + 1.4),
          );
        }
        pos.needsUpdate = true;
        wm.geometry.computeVertexNormals();
      }
      cm.color.lerp(targetColorRef.current, 0.05);
      wmt.color.copy(cm.color);
    }
  });

  if (!model) return null;
  return <primitive object={model} />;
}

interface Props {
  fillTarget: number;
  color:      string;
}

export default function GlassScene({ fillTarget, color }: Props) {
  return (
    <Canvas
      style={StyleSheet.absoluteFill}
      camera={{ fov: 38 }}
      onCreated={({ gl, scene }) => {
        gl.toneMapping          = THREE.ReinhardToneMapping;
        gl.toneMappingExposure  = 1.3;
        gl.outputColorSpace     = THREE.SRGBColorSpace;
        gl.localClippingEnabled = true;
        scene.background        = new THREE.Color('#f5f5f0');
      }}
    >
      <ambientLight intensity={2.0} />
      <directionalLight position={[-1, 2, 1.5]} intensity={3.0} />
      <directionalLight color="#d0e8ff" position={[1, 0.5, -1]} intensity={1.5} />
      <directionalLight position={[0, -1, -2]} intensity={1.5} />
      <GlassModel fillTarget={fillTarget} color={color} />
    </Canvas>
  );
}
