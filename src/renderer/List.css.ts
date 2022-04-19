import { style } from '@vanilla-extract/css';

export const listClass = style({
  fontSize: '14px',
  marginBottom: 12,
});

export const listHeaderClass = style({
  display: 'flex',
  justifyContent: 'center',
  fontSize: '14px',
  fontWeight: 'bold',
  padding: '4px 0',
  flexShrink: 0,
});

export const listItemClass = style({
  padding: '4px 8px',
  cursor: 'pointer',
  color: '#ccd',
  selectors: {
    '&.selected': {
      backgroundColor: '#445',
    }
  }
});
