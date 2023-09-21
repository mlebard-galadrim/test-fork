import { getBottomSpace, getStatusBarHeight } from './safe-areas-helper';

// Colors
export const COLOR_PRIMARY = '#009CDA';
export const COLOR_SECONDARY = '#4A4A4A';
export const COLOR_UNDERLAY = '#9B9B9B';
export const COLOR_LIGHT_BG = '#EFEFF4';
export const COLOR_ERROR = '#cc453b';
export const COLOR_PLACEHOLDER = '#aaa9aa';
export const COLOR_SUCCESS = '#749943';
export const COLOR_NOTIFICATION = '#ff6060';
export const COLOR_WARNING = '#ffbf60';
export const COLOR_INFO = '#6fc3f2';
export const COLOR_DRAWER = '#00415a';
export const COLOR_TAB_ACTIVE = '#6ebbd7';

// Sizes
export const HEIGHT_HEADER = 44;
export const NAVBAR_FONT_SIZE = 17;
export const NAVBAR_LINE_HEIGHT = 17;
export const NAVBAR_ICON_SIZE = 20;
export const GUTTER = 10;
export const STATUS_BAR = getStatusBarHeight(true);
export const BOTTOM_SPACE = getBottomSpace();

// Spacing
export const SPACING = GUTTER; // Alias, to refacto
export const SPACING_TEXT = SPACING / 2;
