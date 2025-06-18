import React, { useState, useEffect, useCallback } from 'react';
import { PropTypes } from 'prop-types';
import { makeStyles } from 'tss-react/mui';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import Loading from '@mui/material/LinearProgress';
import { useSelector, useDispatch } from 'react-redux';
import {
  changeThemeAction,
  changeModeAction,
  changeGradientAction,
  changeDecoAction,
  changeLayoutAction,
  changeBgPositionAction,
  changeDirectionAction
} from 'dan-redux/modules/ui';
import { TemplateSettings } from 'dan-components';
import appTheme from '../../styles/theme/applicationTheme';

const useStyles = makeStyles()(() => ({
  root: {
    width: '100%',
    minHeight: '100%',
    marginTop: 0,
    zIndex: 1,
  },
  loading: {
    zIndex: '10 !important',
    position: 'fixed !important',
    top: 0,
    left: 0,
    width: '100%',
    opacity: 1,
    transition: 'opacity .5s ease'
  },
  loadingWrap: {
    background: 'none !important'
  },
  bar: {
    background: 'rgba(255, 255, 255, 0.7) !important'
  },
  hide: {
    opacity: 0
  }
}));

const isBrowser = typeof document !== 'undefined';
let insertionPoint;

if (isBrowser) {
  const emotionInsertionPoint = document.querySelector(
    'meta[name="emotion-insertion-point"]',
  );
  insertionPoint = emotionInsertionPoint ?? undefined;
}

const cacheRTL = createCache({
  key: 'mui-style-rtl',
  stylisPlugins: [prefixer, rtlPlugin],
  insertionPoint,
});

const cacheLTR = createCache({
  key: 'mui-style-ltr',
  insertionPoint,
});

export const ThemeContext = React.createContext(undefined);

function ThemeWrapper(props) {
  const { classes } = useStyles();
  const [progress, setProgress] = useState(0);
  const dispatch = useDispatch();

  const color = useSelector((state) => state.ui.theme);
  const mode = useSelector((state) => state.ui.type);
  const palette = useSelector((state) => state.ui.palette);
  const direction = useSelector((state) => state.ui.direction);
  const gradient = useSelector((state) => state.ui.gradient);
  const decoration = useSelector((state) => state.ui.decoration);
  const bgPosition = useSelector((state) => state.ui.bgPosition);
  const layout = useSelector((state) => state.ui.layout);

  const [theme, setTheme] = useState(
    appTheme(color, mode, direction)
  );

  const [paletteState, setPalette] = useState([]);

  useEffect(() => {
    setPalette(palette);
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
        }
        const diff = Math.random() * 40;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleChangeTheme = event => {
    setTheme(appTheme(event.target.value, mode, direction));
    dispatch(changeThemeAction(event.target.value));
  };

  const handleChangeRandomTheme = useCallback(() => {
    const paletteArray = palette;
    const randomTheme = paletteArray[Math.floor(Math.random() * paletteArray.length)];

    setTimeout(() => {
      setTheme(appTheme(randomTheme.value, mode, direction));
    }, 500);
    dispatch(changeThemeAction(randomTheme.value));
  }, [theme]);

  const handleChangeMode = mode => { // eslint-disable-line
    dispatch(changeModeAction(mode));
    setTheme(appTheme(color, mode));
  };

  const handleChangeGradient = value => {
    dispatch(changeGradientAction(value));
  };

  const handleChangeDecoration = value => {
    dispatch(changeDecoAction(value));
  };

  const handleChangeBgPosition = value => {
    dispatch(changeBgPositionAction(value));
  };

  const handleChangeLayout = value => {
    dispatch(changeLayoutAction(value));
  };

  const handleChangeDirection = dirVal => {
    // Set reducer state direction
    setTheme(appTheme(color, mode, dirVal));
    dispatch(changeDirectionAction(dirVal));

    // Set HTML root direction attribute
    document.dir = dirVal;
  };

  const muiTheme = createTheme(theme);
  const { children } = props;

  return (
    <CacheProvider value={theme.direction === 'rtl' ? cacheRTL : cacheLTR}>
      <ThemeProvider theme={muiTheme}>
        <div className={classes.root}>
          <Loading
            variant="determinate"
            value={progress}
            className={progress >= 100 ? classes.hide : ''}
            classes={{
              root: classes.loading,
              colorPrimary: classes.loadingWrap,
              barColorPrimary: classes.bar
            }}
          />
          <TemplateSettings
            palette={paletteState}
            selectedValue={color}
            mode={mode}
            gradient={gradient}
            decoration={decoration}
            bgPosition={bgPosition}
            layout={layout}
            direction={direction}
            changeTheme={handleChangeTheme}
            changeRandomTheme={handleChangeRandomTheme}
            changeMode={handleChangeMode}
            changeGradient={handleChangeGradient}
            changeDecoration={handleChangeDecoration}
            changeBgPosition={handleChangeBgPosition}
            changeLayout={handleChangeLayout}
            changeDirection={handleChangeDirection}
          />
          <ThemeContext.Provider value={handleChangeMode}>
            {children}
          </ThemeContext.Provider>
        </div>
      </ThemeProvider>
    </CacheProvider>
  );
}

ThemeWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ThemeWrapper;
