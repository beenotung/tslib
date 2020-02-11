import { filesForEach } from '../src/file';
import { compressMobilePhoto } from '../src/image';

let meta = document.createElement('meta');
meta.name = 'viewport';
meta.content = 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no';
document.head.appendChild(meta);

let input = document.createElement('input');
input.type = 'file';
input.onchange = () => {
  let files = input.files;
  if (!files) {
    return;
  }
  filesForEach(files, file => {
    compressMobilePhoto({ image: file })
      .then(base64 => {
        let image = document.createElement('img');
        image.src = base64;
        image.style.maxWidth = '100%';
        document.body.appendChild(image);
      });
  });
};
document.body.appendChild(input);
document.body.appendChild(document.createElement('br'));
