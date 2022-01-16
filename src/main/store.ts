import Store from 'electron-store';

// Schema for storing window position.
export const store = new Store({
  schema: {
    window: {
      type: 'object',
      properties: {
        x: {
          type: 'number',
        },
        y: {
          type: 'number',
        },
        width: {
          type: 'number',
        },
        height: {
          type: 'number',
        },
        isMaximized: {
          type: 'boolean',
        },
      },
      additionalProperties: false,
    },
  },
});

export type SavedWindowState = Partial<Electron.Rectangle> & {
  isMaximized: boolean;
};
