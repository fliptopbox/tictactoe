export default hexToRGB;
function hexToRGB(hex, float = true) {

    if (!hex) return null;

    const factor = float ? 255 : 1;

    hex = hex.replace(/[^0-9a-f]+/gi, "");
    let array = hex.length < 6
            ? hex.split(/([0-9a-f]{1})/)
            : hex.split(/([0-9a-f]{2})/);

    // remove empty registers
    array = array.filter(v => v.length);

    // convert to Bytes or Floating point normal
    array = array
        .map(v => (v.length - 1 ? `0x${v}` : `0x${v}${v}`))
        .map(s => Number(s) / factor)
        .slice(0, 3);

    return array;
}
