import { FC } from 'react';
import { Object3D } from 'three';
import {
  treeChildrenClass,
  treeNodeClass,
  treeNodeName,
  treeNodeType,
  treeViewClass,
} from './TreeView.css';

interface Props {
  obj: Object3D;
}

const TreeNode: FC<Props> = ({ obj }) => {
  return (
    <div className={treeNodeClass}>
      <div>
        <span className={treeNodeName}>{obj.name}:</span>{' '}
        <span className={treeNodeType}>{obj.constructor.name}</span>
      </div>
      <div className={treeChildrenClass}>
        {obj.children.map(child => (
          <TreeNode key={child.uuid} obj={child} />
        ))}
      </div>
    </div>
  );
};

export const TreeView: FC<Props> = ({ obj }) => (
  <div className={treeViewClass}>
    {obj.children.map(child => (
      <TreeNode key={child.uuid} obj={child} />
    ))}
  </div>
);
