import { relightnessify, modifyUserColorForText } from './util';

/** Defines the layout of colors for the favicon. */
const imageLayout = [
    4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
    2, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0,
    2, 2, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0, 0,
    2, 2, 2, 4, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0, 0, 0,
    2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    2, 2, 2, 4, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0, 0, 0,
    2, 2, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0, 0,
    2, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0,
    4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3
];

/** A utility class for dynamically generating the site's favicon based on a given theme color. */
export default class FaviconGenerator {
    constructor() {
        this.elem = document.querySelector('link[rel$="icon"]');
        this.lastColor = undefined;
    }

    setToColor(color) {
        // Prevent regenerating the same color across updates.
        if (color === this.lastColor) {
            return;
        }
        this.lastColor = color;

        // The array of RGBA component values for the favicon.
        const image = new Uint8Array(16 * 16 * 4);

        // The array of colors.
        const colors = [
            relightnessify(color, 10, 90).rgb(), // The base color
            modifyUserColorForText(color).rgb(), // The upper/lower border colors
            modifyUserColorForText(color).lighten(0.2).rgb(), // The left border color
            relightnessify(color, 10, 90).mix(modifyUserColorForText(color)).rgb(), // The border-to-bg edge color
            modifyUserColorForText(color).mix(modifyUserColorForText(color).lighten(0.2)).rgb() // The border-to-border edge color
        ];

        // Render each RGBA quartet (in BGRA order) into `image` based off the definition of
        // `imageLayout`
        for (let y = 0; y < 16; y++) {
            for (let x = 0; x < 16; x++) {
                const color = colors[imageLayout[y * 16 + x]];
                for (let i = 0; i < 4; i++) {
                    image[y * 16 * 4 + x * 4 + i] = i === 3 ? 255 : color.color[2 - i];
                }
            }
        }

        // Set the icon to the icon data generated from `image`
        this.setIcon(this.imageToIconData(image, 16, 16));
    }

    /**
     * Sets the favicon to the given `.ico` data.
     * @param {Uint8Array} data The `.ico` data to set as the favicon.
     */
    setIcon(data) {
        this.elem.href = URL.createObjectURL(new Blob([data], { type: 'image/x-icon' }));
    }

    /**
     * Converts a 
     * @param {Uint8Array} image The image data (in BGRA order)
     * @param {number} width The width of the icon
     * @param {number} height The height of the icon
     */
    imageToIconData(image, width, height) {
        const data = new Uint8Array(0x16 + 0x28 + image.length);

        // What follows is my attempt at recreating the `.ico` binary format based on the little
        // knowledge of it I could find online.

        data[0x00] = 0x00;
        data[0x01] = 0x00;
        data[0x02] = 0x01;
        data[0x03] = 0x00;
        data[0x04] = 0x01;
        data[0x05] = 0x00;

        data[0x06] = width;
        data[0x07] = height;
        data[0x08] = 0x00;
        data[0x09] = 0x00;
        data[0x0A] = 0x01;
        data[0x0B] = 0x00;
        data[0x0C] = 0x20;
        data[0x0D] = 0x00;
        data[0x0E] = (image.length + 0x28) & 0xFF;
        data[0x0F] = ((image.length + 0x28) >> 8) & 0xFF;
        data[0x10] = ((image.length + 0x28) >> 16) & 0xFF;
        data[0x11] = ((image.length + 0x28) >> 24) & 0xFF;
        data[0x12] = 0x16;
        data[0x13] = 0x00;
        data[0x14] = 0x00;
        data[0x15] = 0x00;

        data[0x16] = 0x28;
        data[0x17] = 0x00;
        data[0x18] = 0x00;
        data[0x19] = 0x00;
        data[0x1A] = width;
        data[0x1B] = 0x00;
        data[0x1C] = 0x00;
        data[0x1D] = 0x00;
        data[0x1E] = height * 2; // why * 2? I don't know, but it doesn't work otherwise.
        data[0x1F] = 0x00;
        data[0x20] = 0x00;
        data[0x21] = 0x00;
        data[0x22] = 0x01;
        data[0x23] = 0x00;
        data[0x24] = 0x20;
        data[0x25] = 0x00;
        data[0x26] = 0x00;
        data[0x27] = 0x00;
        data[0x28] = 0x00;
        data[0x29] = 0x00;
        data[0x2A] = image.length & 0xFF;
        data[0x2B] = (image.length >> 8) & 0xFF;
        data[0x2C] = (image.length >> 16) & 0xFF;
        data[0x2D] = (image.length >> 24) & 0xFF;
        data[0x2E] = 0x13;
        data[0x2F] = 0x0B;
        data[0x30] = 0x00;
        data[0x31] = 0x00;
        data[0x32] = 0x13;
        data[0x33] = 0x0B;
        data[0x34] = 0x00;
        data[0x35] = 0x00;
        data[0x36] = 0x00;
        data[0x37] = 0x00;
        data[0x38] = 0x00;
        data[0x39] = 0x00;
        data[0x3A] = 0x00;
        data[0x3B] = 0x00;
        data[0x3C] = 0x00;
        data[0x3D] = 0x00;

        // Bitmap images start bottom-left first, whereas we expect `image` to be top-left first.
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                for (let i = 0; i < 4; i++) {
                    data[0x3E + (height - y - 1) * width * 4 + x * 4 + i] = image[y * width * 4 + x * 4 + i];
                }
            }
        }

        return data;
    }
}
