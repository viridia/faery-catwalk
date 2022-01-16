import { style } from '@vanilla-extract/css';

export const treeViewClass = style({
  fontSize: '14px',
  position: 'absolute',
  right: 10,
  top: 10,
  bottom: 10,
  overflowY: 'auto',
  overflowX: 'hidden',
  paddingRight: '1rem',
  color: '#bbc',
  selectors: {
    '&::-webkit-scrollbar': {
      backgroundColor: 'transparent',
      width: 7,
      height: 7,
    },

    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      borderRadius: 6,
    },

    '&::-webkit-scrollbar-thumb:window-inactive': {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },

    '&::-webkit-scrollbar-corner': {
      backgroundColor: 'transparent',
    },
  },
});

export const treeNodeClass = style({
  margin: '2px 0',
});

export const treeNodeName = style({
});

export const treeNodeType = style({
  fontStyle: 'italic',
  color: '#889'
});

export const treeChildrenClass = style({
  marginLeft: '1rem',
});
