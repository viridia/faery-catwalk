import { useCallback, useEffect, useState } from 'react';
import {
  buttonClass,
  filePathClass,
  labelClass,
  messageClass,
  noFilePathClass,
  pageBodyClass,
  pageClass,
  pageHeaderClass,
  sidebarClass,
  viewClass,
} from './App.css';
import { Renderer } from './Renderer';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { List } from './List';
import { Group, Object3D } from 'three';
import { TreeView } from './TreeView';

function App() {
  const [elt, setElt] = useState<HTMLElement | null>(null);
  const [renderer, setRenderer] = useState<Renderer>();
  const [filePath, setFilePath] = useState('');
  const [gltf, setGltf] = useState<GLTF>();
  const [showTree, setShowTree] = useState(false);
  const [skins, setSkins] = useState<Object3D[]>([]);
  const [armature, setArmature] = useState<Object3D | null>(null);
  const [selectedSkin, setSelectedSkin] = useState('');
  const [selectedAnimation, setSelectedAnimation] = useState('');
  // const [canDrop, setCanDrop] = useState(false);

  // We can't construct the renderer until we have an element to attach it to.
  useEffect(() => {
    if (elt) {
      const renderer = new Renderer(elt);
      setRenderer(renderer);

      // Destroy renderer when element changes or this component goes out of scope.
      return () => renderer.dispose();
    }
  }, [elt]);

  useEffect(() => {
    if (renderer) {
      const model = gltf?.scene.getObjectByName(selectedSkin);
      const clip = gltf?.animations.find(clip => clip.name === selectedAnimation);
      renderer.display(model, armature, clip);
    }
  }, [gltf, renderer, selectedAnimation, selectedSkin, armature]);

  const onOpenFile = useCallback(() => {
    window.bridge.ipcRenderer.invoke('open-file').then((filePath: string) => {
      setFilePath(filePath);
      const data = window.bridge.fs.readFileSync(filePath);
      const loader = new GLTFLoader();
      loader.load(
        URL.createObjectURL(new Blob([data])),
        gltf => {
          setGltf(gltf);
          const skins = gltf.scene?.children.filter(child => child instanceof Group) ?? [];
          setSkins(skins);
          setSelectedSkin(skins.length > 0 ? skins[0].name : '');
          const firstClip = gltf.animations[0];
          setSelectedAnimation(firstClip ? firstClip.name : '');
          const armature = gltf.scene?.children.find(child => child.name.match(/armature/i));
          setArmature(armature ?? null);
        },
        undefined,
        error => {
          console.error(error);
        }
      );
    });
  }, []);

  return (
    <div className={pageClass}>
      <header className={pageHeaderClass}>
        <button className={buttonClass} onClick={onOpenFile}>
          Open File&hellip;
        </button>
        <button className={buttonClass}>Open Folder&hellip;</button>
        {filePath ? (
          <div className={filePathClass}>{filePath}</div>
        ) : (
          <div className={noFilePathClass}>No file selected</div>
        )}
        <label className={labelClass}>
          <input type="checkbox" checked={showTree} onChange={e => {
            e.preventDefault();
            setShowTree(e.currentTarget.checked);
          }} />
          Tree
        </label>
      </header>
      <div className={pageBodyClass}>
        {gltf && (
          <div className={sidebarClass}>
            <List
              title="Skins"
              items={skins
                .map(child => ({
                  name: child.name,
                  value: child.name,
                }))}
              selected={selectedSkin}
              onChange={selected => setSelectedSkin(selected)}
            />
            <List
              title="AnimationClips"
              items={gltf.animations.map(clip => ({
                name: clip.name,
                value: clip.name,
              }))}
              selected={selectedAnimation}
              onChange={selected => setSelectedAnimation(selected)}
            />
          </div>
        )}
        <div className={viewClass} ref={setElt}>
          {!gltf && <div className={messageClass}>Nothing loaded</div>}
          {gltf && showTree && <TreeView obj={gltf.scene} />}
        </div>
      </div>
    </div>
  );
}

export default App;
