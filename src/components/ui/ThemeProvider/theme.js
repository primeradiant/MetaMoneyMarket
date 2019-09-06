export const preset = {
  colors: {
    text: {
      light: '#fff',
      dark: '#000',
    },
    background: '#fff',
    primary: '#0A6054',
    muted: '#E7EFEE',
    negative: '#E05252',
    positive: '#52E0A4',
  },
  fonts: {
    body:
      '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol',
    heading: 'Lexend Deca, sans-serif',
    monospace: 'Menlo, monospace',
  },
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 96],
  fontWeights: {
    body: 400,
    heading: 'normal',
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.25,
    solid: 1,
  },
  space: [0, 4, 8, 16, 32, 64, 96, 128, 256, 512],
  sizes: {
    icon: 24,
    avatar: 48,
  },
  radii: {
    default: 0,
    circle: 99999,
  },
  shadows: {
    card: '0 0 4px rgba(0, 0, 0, .125)',
  },
  // rebass variants
  text: {
    heading: {
      fontFamily: 'heading',
      lineHeight: 'heading',
      fontWeight: 'heading',
    },
    subheading: {
      fontSize: 4,
      maxWidth: 600,
    },
    h1: {
      fontSize: [5, 6],
    },
    h2: {
      fontSize: [4, 5],
    },
    h3: {
      fontSize: [3, 4],
    },
    caps: {
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
    paragraph: {
      maxWidth: '55ch',
    },
  },
  variants: {
    icon: {
      section: {
        height: 80,
        width: 80,
        verticalAlign: 'middle',
      },
      card: {
        height: 64,
        width: 64,
        verticalAlign: 'middle',
      },
    },
    container: {
      px: 3,
      maxWidth: 1136 + 16 * 2,
      mx: 'auto',
    },
    hero: {
      py: [6, 7],
    },
    section: {
      py: [5, 6],
    },
    avatar: {
      width: 'avatar',
      height: 'avatar',
      borderRadius: 'circle',
    },
    card: {
      p: 32 - 2,
      bg: 'background',
      borderColor: 'muted',
      borderWidth: 2,
      borderStyle: 'solid',
    },
    link: {
      color: 'primary',
      fontWeight: 'semibold',
      textDecoration: 'none',
      ':hover,:focus,.active': {
        textDecoration: 'underline',
      },
    },
    footer: {
      wrapper: {
        py: [6, 7],
      },
      icon: {
        width: 'icon',
        height: 'icon',
      },
      logo: {
        height: [72, 88],
        verticalAlign: 'middle',
      },
    },
    nav: {
      logo: {
        width: [32, 40],
        height: [32, 40],
        verticalAlign: 'middle',
      },
      wrapper: {
        pt: [16, 32],
        pb: [16 - 2, 32 - 2],
        borderBottomWidth: 2,
        borderBottomStyle: 'solid',
        borderBottomColor: 'muted',
      },
      link: {
        fontSize: 1,
        fontWeight: 'bold',
        display: 'inline-block',
        p: 2,
        color: 'inherit',
        textDecoration: 'none',
        ':hover,:focus,.active': {
          color: 'primary',
        },
      },
    },
    table: {
      width: '100%',
      fontSize: 2,
    },
    tbody: {},
    thead: {},
    th: {
      variant: 'variants.td',
      fontWeight: 'medium',
    },
    tr: {
      ':last-child > td': {
        border: 'none',
      },
    },
    td: {
      textAlign: 'left',
      borderBottom: '2px solid',
      borderColor: 'muted',
      py: 10,
      px: 12,
    },
  },
  buttons: {
    primary: {
      cursor: 'pointer',
      fontSize: 3,
      py: '14px',
      px: '18px',
      lineHeight: 'solid',
      fontWeight: 'semibold',
      color: 'background',
      bg: 'primary',
      borderRadius: 'default',
    },
    small: {
      variant: 'buttons.primary',
      py: '12px',
      px: 3,
      fontSize: 2,
    },
    text: {
      variant: 'buttons.primary',
      py: '10px',
      px: '18px',
      color: 'primary',
      bg: 'transparent',
    },
  },
  forms: {
    input: {
      color: 'text.dark',
      borderColor: 'primary',
      backgroundColor: 'background',
      borderWidth: 2,
      px: 3,
      fontWeight: 'medium',
    },
    select: {},
    textarea: {},
    label: {},
    radio: {},
    checkbox: {},
  },
  styles: {
    root: {
      fontFamily: 'body',
      fontWeight: 'body',
      lineHeight: 'body',
      fontSize: [2, 18],
      color: 'text.dark',
    },
  },
};

export default preset;
