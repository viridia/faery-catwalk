import { style } from '@vanilla-extract/css';

export const pageClass = style({
  backgroundColor: '#334',
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'sans-serif',
  padding: 0,
  position: 'fixed',
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
});

export const pageHeaderClass = style({
  alignItems: 'center',
  padding: '4px',
  display: 'flex',
  fontSize: '13px',
  gap: '4px',
  borderBottom: '1px solid black',
});

export const pageBodyClass = style({
  alignItems: 'stretch',
  display: 'flex',
  flex: '1',
  minHeight: 0,
  minWidth: 0,
});

export const filePathClass = style({
  flex: 1,
  marginLeft: '8px',
  color: '#ccc',
});

export const noFilePathClass = style([
  filePathClass,
  {
    color: '#aaa',
    fontStyle: 'italic',
  },
]);

export const viewClass = style({
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  position: 'relative',
});

export const messageClass = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  color: '#889',
  fontStyle: 'italic',
});

export const sidebarClass = style({
  backgroundColor: '#2c2c3c',
  display: 'flex',
  flexDirection: 'column',
  padding: '4px 8px',
  overflowY: 'auto',

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

export const buttonClass = style({
  backgroundColor: '#445',
  border: '1px solid #222224',
  borderRadius: 2,
  color: '#ccc',
  height: '1.7rem',
  padding: '0 1rem',

  ':hover': {
    backgroundColor: '#4f4f64',
  },

  ':active': {
    backgroundColor: '#334',
  },
});

export const labelClass = style({
  display: 'flex',
  alignItems: 'center',
  gap: 3,
  marginRight: 4,
});
