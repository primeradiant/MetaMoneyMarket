import React from 'react';
import {Box} from 'rebass';
import Footer from '../Footer';
import Navigation from '../Navigation';
import Root from '../Root';
import ThemeProvider from '../ThemeProvider';

const Wrapper: React.FC = ({children}) => (
  <ThemeProvider>
    <Root>
      <Navigation />
      <Box as="main" flex={1}>
        {children}
      </Box>
      <Footer />
    </Root>
  </ThemeProvider>
);

export default Wrapper;
