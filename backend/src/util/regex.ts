export const FLOATING_POINT_REGEX = '[-+]?[0-9]+(\.[0-9])?' // 1 decimal place
export const OPACITY_REGEX = '(1(\.0)?|0(\.[0-9])?)'
export const NUMBER_REGEX = '[0-9]+'
export const STRING_REGEX = '[a-zA-Z]+'
export const IDENTIFIER_REGEX = '[A-Za-z0-9]+'
export const SCALE_REGEX = '[0-9]+(\.[0-9])?'
export const COORDINATE_REGEX = '\\[[0-9]+,[0-9]+\]'
export const OBJECTS_REGEX = '\\[([a-zA-Z0-9]* ?)+\]' // included ' ?' for parsing parameter
export const POINTS_REGEX = '\\[(\\[[0-9]+,[0-9]+\] ?){3,}\]' // included ' ?' for parsing parameter
export const FILL_REGEX = '(' + STRING_REGEX + '|[0-9A-Fa-f]{6})'
export const DIRECTION_REGEX = '(up|down|right|left)'
export const SHAPE_REGEX =
  '(circle|rectangle|triangle|pentagon|hexagon|octagon|polygon)'
