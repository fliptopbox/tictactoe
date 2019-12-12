let serial = 0;

export default uuid;
function uuid(ns = "x") {
  // temporary generator
  const int = (Math.random() * 36) >> 0;
  serial += 1;
  return [
    ns, //
    //( serial % 36 ).toString(36),
    ( serial % 36 ).toString(36),
    int.toString(36),
    Number(new Date().valueOf()).toString(36),
  ].join("");
}