import {ThemeProvider as EmotionThemeProvider} from 'emotion-theming';
import React from 'react';
import theme from './theme';

const ThemeProvider: React.FC = props => <EmotionThemeProvider theme={theme} {...props} />;

export default ThemeProvider;
