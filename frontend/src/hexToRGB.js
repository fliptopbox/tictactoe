export default hexToRGB;
function hexToRGB(hex, float = true) {

    if (!hex) return null;

    const factor = float ? 255 : 1;

    hex = hex.replace(/^0x+/, "");
    hex = hex.replace(/[^0-9a-f]+/gi, "");
    hex = hex.toLowerCase();

    let array = hex.length < 6
            ? hex.split(/([0-9a-f]{1})/i)
            : hex.split(/([0-9a-f]{2})/i);

    // remove empty registers
    array = array.filter(v => v.length);

    // convert to Bytes or Floating point normal
    array = array
        .map(v => (v.length - 1 ? `0x${v}` : `0x${v}${v}`))
        .map(s => Number(s) / factor)
        .slice(0, 3);

    return array;
}
