export const colors = {
  spanishGray: 'hsl(0, 0%, 60%)',
  sonicSilver: 'hsl(0, 0%, 47%)',
  eerieBlack: 'hsl(0, 0%, 13%)',
  salmonPink: 'hsl(353, 100%, 78%)',
  sandyBrown: 'hsl(29, 90%, 65%)',
  bittersweet: 'hsl(0, 100%, 70%)',
  oceanGreen: 'hsl(152, 51%, 52%)',
  davysGray: 'hsl(0, 0%, 33%)',
  cultured: 'hsl(0, 0%, 93%)',
  white: 'hsl(0, 100%, 100%)',
  onyx: 'hsl(0, 0%, 27%)',
} as const;

export const typography = {
  family: 'Poppins',
  sizes: {
    fs1: '1.563rem',
    fs2: '1.375rem',
    fs3: '1.25rem',
    fs4: '1.125rem',
    fs5: '1rem',
    fs6: '0.938rem',
    fs7: '0.875rem',
    fs8: '0.813rem',
    fs9: '0.75rem',
    fs10: '0.688rem',
    fs11: '0.625rem',
  },
  weights: { light: 300, regular: 400, medium: 500, semibold: 600, bold: 700 },
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  section: '60px',
} as const;

export const radii = { sm: '5px', md: '10px', pill: '999px' } as const;

export const designTokens = { colors, typography, spacing, radii } as const;

export type DesignTokens = typeof designTokens;
