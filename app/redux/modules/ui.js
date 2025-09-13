import { createSlice } from '@reduxjs/toolkit';
import menuContent from 'dan-api/ui/menu';
import { getSibarContent } from 'dan-api/ui/newMenu';

const initialState = {
  /* Settings for Themes and layout */
  theme: 'skyBlueTheme',
  direction: 'ltr',
  type: 'light', // light or dark
  gradient: true, // true or false
  decoration: true, // true or false
  bgPosition: 'header', // half, header, full
  layout: 'left-sidebar', // big-sidebar, left-sidebar, top-navigation, mega-menu
  /* End settings */
  palette: [
    { name: 'Ocean Sky', value: 'skyBlueTheme' },
    { name: 'Purple', value: 'purpleRedTheme' },
    { name: 'Rose Gold', value: 'magentaTheme' },
    { name: 'Leaf', value: 'cyanTheme' },
    { name: 'Mint', value: 'blueCyanTheme' },
    { name: 'Ubuntu', value: 'orangeTheme' },
    { name: 'Ultra Violet', value: 'purpleTheme' },
    { name: 'Vintage', value: 'yellowCyanTheme' },
    { name: 'Fruit', value: 'greenOrangeTheme' },
    { name: 'Botani', value: 'pinkGreenTheme' },
    { name: 'Deep Ocean', value: 'blueTheme' },
    { name: 'School', value: 'yellowBlueTheme' },
    { name: 'Queen', value: 'pinkBlueTheme' },
    { name: 'Joker', value: 'greenPurpleTheme' },
    { name: 'Ruby', value: 'redTheme' },
    { name: 'Sultan', value: 'goldTheme' },
    { name: 'Monochrome', value: 'greyTheme' },
  ],
  sidebarOpen: true,
  pageLoaded: false,
  subMenuOpen: []
};

const getMenus = menuArray => menuArray.map(item => {
  if (item.child) {
    return item.child;
  }
  return false;
});

// const setNavCollapse = (arr, curRoute) => {
//   console.log('arr', arr)
//   console.log('curRoute', curRoute);
//   console.log('menuData', menuContent);

//   let headMenu = 'not found';
//   for (let i = 0; i < arr.length; i += 1) {
//     for (let j = 0; j < arr[i].length; j += 1) {
//       // console.log('menuContent[i].key', menuContent[i].key);
//       console.log('arr[i][j].link', arr[i][j].link);
//       if (arr[i][j].link === curRoute) {
//         console.log('menuContent[i].key', menuContent[i].key);
//         headMenu = menuContent[i].key;
//       }
//     }
//   }
//   return headMenu;
// };

const setNavCollapse = (arr, curRoute) => {
  // console.log('arr', arr)
  // console.log('curRoute', curRoute);
  const menuData = getSibarContent();
  // console.log('menuData', menuData);

  let headMenu = 'not found';

  for (let i = 0; i < arr.length; i += 1) {
    for (let j = 0; j < arr[i].length; j += 1) {
      // console.log('arr[i][j].link', arr[i][j].link);
      if (arr[i][j].link === curRoute) {
        // console.log('menuData[i].key', menuData[i].key);
        headMenu = menuData[i].key;
      }
    }
  }
  return headMenu;
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleAction: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    openMenuAction: (state) => {
      state.sidebarOpen = true;
    },
    closeMenuAction: (state) => {
      state.sidebarOpen = false;
      state.subMenuOpen = [];
    },




    openAction: (state, action) => {
      const { initialLocation, key } = action.payload;
      // console.log('initialLocation, key', initialLocation, key);
      // Set initial open parent menu
      const dataMenu = getSibarContent();
      const activeParent = setNavCollapse(
        // getMenus(menuContent),
        getMenus(dataMenu),
        initialLocation
      );
      // Once page loaded will expand the parent menu
      if (initialLocation) {
        state.subMenuOpen = [activeParent];
        return;
      }
      // Expand / Collapse parent menu
      const menuList = state.subMenuOpen;
      if (menuList.indexOf(key) > -1) {
        const index = state.subMenuOpen.findIndex((obj) => obj === key);
        state.subMenuOpen.splice(index, 1);
      } else {
        state.subMenuOpen = [key];
      }
    },




    changeThemeAction: (state, action) => {
      state.theme = action.payload;
    },
    changeRandomThemeAction: (state) => {
      const paletteArray = initialState.palette;
      const random = paletteArray[Math.floor(Math.random() * paletteArray.length)];
      state.theme = random.value;
    },
    changeModeAction: (state, action) => {
      state.type = action.payload;
    },
    changeGradientAction: (state, action) => {
      state.gradient = action.payload;
    },
    changeDecoAction: (state, action) => {
      state.decoration = action.payload;
    },
    changeLayoutAction: (state, action) => {
      state.layout = action.payload;
    },
    changeBgPositionAction: (state, action) => {
      state.bgPosition = action.payload;
    },
    changeDirectionAction: (state, action) => {
      state.direction = action.payload;
    },
    playTransitionAction: (state, action) => {
      state.pageLoaded = action.payload;
    }
  }
});

export const {
  toggleAction, openMenuAction,
  closeMenuAction, openAction,
  changeThemeAction, changeRandomThemeAction, changeModeAction,
  changeGradientAction, changeDecoAction, changeLayoutAction,
  changeBgPositionAction, changeDirectionAction, playTransitionAction
} = uiSlice.actions;

export default uiSlice.reducer;
