let sizes = `
UHD 3840x2160
QHD 2560x1440
FHD 1920x1080
 HD 1280x720
VGA  640x480

iPhone5     320x568
iPhone6     375x667
iPhoneX     375x812
GalaxyS5    360x640
GalaxyNote9 414x846
`;
 const code =  sizes
    .split('\n')
    .map(line=>line.split(' ')
      .filter(s=>s))
    .filter(xs=>xs.length>0)
    .map(xs=>{
      let[name,dimension]=xs
      let [w,h]=dimension.split('x')
      return `export const ${name}: Dimension = { width: ${w}, height: ${h} };`
    })
    .join('\n')
      ;
(function() {
  return `
export type Dimension = {
  width: number;
  height: number;
};

${code}
`.trim() + '\n';
})();
