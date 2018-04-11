const color = require('color');
const random = require('random-seed');

/**
 * Creates an array with the integers 0 .. n-1, or `[0, n)`
 * @param {number} n The range of the resulting array.
 */
export function range(n) {
    return new Array(n).fill(0).map((_, i) => i);
}

/**
 * Rescales a number from one scale to another.
 * 
 * For example, if n = 0.5 is given with an original scale 0 to 1, and our target scale is 4 to 6,
 * then the result will be 5 because 0.5 is 50% between 0 to 1, and 5 is the same 50% between 4 to
 * 6.
 * 
 * @param {number} n The number to rescale
 * @param {number} originalMin The original scale's minimum
 * @param {number} originalMax The original scale's maximum
 * @param {number} targetMin The target scale's minimum
 * @param {number} targetMax The target scale's maximum
 */
export function rescale(n, originalMin, originalMax, targetMin, targetMax) {
    return targetMin + (targetMax - targetMin) * (n - originalMin) / (originalMax - originalMin);
}

/** Returns whether a color is dark via its luminosity, given a certain percent threshold. */
export function isDark(color, threshold = 0.5) {
    return color.luminosity() < threshold;
}

/** Returns whether a color is light via its luminosity, given a certain percent threshold. */
export function isLight(color, threshold = 0.5) {
    return color.luminosity() > threshold;
}

/** Rescales the HSL lightness of a color from its original range to a given range `[from, to]`. */
export function relightnessify(themeColor, from, to) {
    return color.hsl(
        themeColor.hue(),
        themeColor.saturationl(),
        rescale(themeColor.lightness(), 0, 100, from, to)
    );
}

/** A standardized method for modifying a user-defined color to use as a border. */
export function modifyUserColorForBorder(userColor) {
    return isDark(userColor, 1/3)
        ? relightnessify(userColor, 20, 100).lighten(0.1)
        : relightnessify(userColor, 0, 80);
}

export function modifyUserColorForText(userColor) {
    return isDark(userColor, 1/2)
        ? relightnessify(userColor, 40, 90).lighten(0.2)
        : relightnessify(userColor, 10, 60).darken(0.2);
}

/**
 * Returns a random color, either based on a session-specific variable, or an actual random seed.
 * @param {boolean} staticSeed Whether a static seed should be used, so the same random color is
 *                             always returned for this session by this function.
 */
export function generateRandomColor(staticSeed = false) {
    const rand = random(staticSeed ? performance.timing.navigationStart : undefined);
    return color.rgb([
        rand(256),
        rand(256),
        rand(256)
    ]);
}
