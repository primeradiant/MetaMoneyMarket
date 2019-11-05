export default {
  colors: {
    text: {
      light: '#fff',
      dark: '#0e100d',
      muted: '#4E504D',
      'muted-light': '#8E908E',
    },
    background: '#fff',
    primary: '#0A6054',
    'primary-disabled': '#8cafa9',
    muted: '#E7EFEE',
    'muted-light': '#F4FAF9',
    'muted-dark': '#D6DEDD',
    'muted-darker': '#A4AAA9',
    negative: '#E05252',
    positive: '#52E0A4',
  },
  fonts: {
    body:
      '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol',
    heading: 'Lexend Deca, sans-serif',
    monospace: 'source-code-pro, Menlo, Monaco, Consolas, Courier New, monospace',
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
      fontSize: [3, 4],
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
    h4: {
      fontSize: [2, 3],
    },
    caps: {
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
    paragraph: {
      maxWidth: '55ch',
    },
    'large-title': {},
    headline: {
      fontSize: ['13px', '15px', '17px'],
      lineHeight: ['20px', '22px'],
      fontWeight: 'semibold',
    },
    body: {
      fontSize: ['13px', '15px', '17px'],
      lineHeight: ['20px', '22px'],
      fontWeight: 'medium',
    },
    'headline-small': {
      fontSize: ['13px', '15px'],
      lineHeight: '20px',
      fontWeight: 'semibold',
    },
    'body-small': {
      fontSize: ['13px', '15px'],
      lineHeight: '20px',
      fontWeight: 'medium',
    },
    'token-name': {
      fontSize: 2,
      color: 'text.muted',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      lineHeight: 1,
      zIndex: 1,
      letterSpacing: '0.01em',
    },
    'asset-key-label': {
      variant: 'text.headline',
      fontSize: ['13px', '15px'],
      color: 'text.muted',
      lineHeight: 1,
      whiteSpace: 'nowrap',
    },
    'modal-title': {
      color: 'text.dark',
      fontFamily: 'body',
      fontSize: 18,
      fontWeight: 'semibold',
      lineHeight: 1,
    },
    'modal-note': {fontSize: 0, fontWeight: 'medium'},
    'modal-error': {
      fontSize: 0,
      color: 'negative',
      fontWeight: 'bold',
    },
  },
  variants: {
    icon: {
      section: {
        height: [72, 88],
        width: [72, 88],
        verticalAlign: 'middle',
      },
      card: {
        height: [48, 56],
        width: [48, 56],
        verticalAlign: 'middle',
      },
      token: {
        height: 24,
        width: 24,
        borderRadius: 'circle',
        backgroundPosition: '50% 50%',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
      },
    },
    container: {
      px: ['16px', '24px'],
      maxWidth: [1136 + 16 * 2, 1136 + 24 * 2],
      mx: 'auto',
    },
    hero: {
      py: [5, 6, 7],
    },
    section: {
      py: [4, 5, 6],
    },
    'section-small': {
      py: [4, 5],
    },
    avatar: {
      width: 'avatar',
      height: 'avatar',
      borderRadius: 'circle',
    },
    card: {
      px: [24 - 2, 32 - 2],
      py: [24 - 2, 32 - 2],
      bg: 'background',
      borderColor: 'muted',
      borderWidth: 2,
      borderStyle: 'solid',
    },
    'card-outer': {
      bg: 'background',
      borderColor: 'muted',
      borderWidth: 2,
      borderStyle: 'solid',
    },
    'card-inner': {
      px: [16 - 2, 24 - 2, 32 - 2],
      py: [16 - 2, 24 - 2, 32 - 2],
    },
    'card-inner-small': {
      p: [16 - 2, 24 - 2],
    },
    'card-inner-short': {
      px: [16 - 2, 24 - 2, 32 - 2],
      py: [16 - 2],
    },
    'modal-card-inner': {
      variant: 'styles.root-styles',
      p: [16 - 2, 24 - 2],
    },
    'asset-grid-row': {alignItems: 'center', mx: -1},
    'asset-grid-col': {flex: 1, px: 1},
    'asset-row': {
      width: '100%',
      display: 'block',
      background: 'none',
      borderRadius: 'none',
      pt: [14, 22, 28],
      pb: [14, 22, 28],
      px: 0,
      border: 'none',
      outline: 'none',
      fontSize: 'inherit',
      textAlign: 'inherit',
      borderBottomColor: 'muted',
      borderBottomWidth: 2,
      borderBottomStyle: 'solid',
      ':first-of-type': {
        pt: 0,
      },
      ':last-of-type': {
        pb: 0,
        borderBottomWidth: 0,
      },
    },
    'modal-data-row': {
      justifyContent: 'space-between',
      px: '10px',
      pt: '10px',
      pb: '8px',
      borderBottomColor: 'muted',
      borderBottomWidth: 2,
      borderBottomStyle: 'solid',
      ':last-of-type': {
        pb: '10px',
        borderBottomWidth: 0,
      },
      ':nth-of-type(even)': {
        bg: 'muted-light',
      },
    },
    divider: {
      height: '2px',
      bg: 'muted',
      width: '100%',
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
      fontSize: [18, 3],
      py: '14px',
      px: '18px',
      lineHeight: 'solid',
      fontWeight: 'semibold',
      color: 'background',
      bg: 'primary',
      borderRadius: 'default',
      whiteSpace: 'nowrap',
      ':disabled': {
        bg: 'primary-disabled',
        cursor: 'not-allowed',
      },
    },
    small: {
      variant: 'buttons.primary',
      py: '12px',
      px: 3,
      fontSize: [2, 2],
    },
    xsmall: {
      variant: 'buttons.primary',
      py: '8px',
      px: 2,
      fontSize: [1, 1],
    },
    text: {
      variant: 'buttons.primary',
      py: '10px',
      px: '18px',
      color: 'primary',
      bg: 'transparent',
    },
    'text-small': {
      variant: 'buttons.text',
      py: 0,
      px: 0,
      fontSize: [2, 2],
    },
    'max-button': {
      cursor: 'pointer',
      variant: 'text.token-name',
      color: 'text.muted-light',
      background: 'none',
      p: 0,
      '&:hover,&:focus,&:active': {
        color: 'text.muted',
      },
    },
    unstyled: {
      background: 'none',
      border: 'none',
      borderRadius: 0,
      p: 0,
      m: 0,
      color: 'text.dark',
      cursor: 'pointer',
      textAlign: 'initial',
      display: 'block',
    },
    'provider-button': {
      variant: 'buttons.unstyled',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'muted-dark',
      fontWeight: 'semibold',
      height: 56,
      px: 1,
      py: 3,
      ':hover, :focus, :active': {
        borderColor: 'muted',
      },
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
    label: {fontWeight: 'bold', mb: 2},
    radio: {},
    checkbox: {},
  },
  styles: {
    'root-styles': {
      fontFamily: 'body',
      fontWeight: 'body',
      lineHeight: 'body',
      fontSize: [2, 18],
      color: 'text.dark',
    },
    root: {
      variant: 'styles.root-styles',
      display: 'flex',
      minHeight: '100vh',
      flexDirection: 'column',
    },
  },
};
