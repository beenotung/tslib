import { checkedFetch } from '../../src/fetch';

let url = 'http://localhost:3000/file/single';

let input = document.createElement('input');
input.type = 'file';
input.onchange = () => {
  for (let i = 0; i < input.files!.length; i++) {
    let file = input.files!.item(i)!;
    let formData = new FormData();
    formData.append('file', file);
    checkedFetch({
      input: url, init: { method: 'POST', body: formData },
      on2xx: res => res.text().then(hash => 'hash: ' + hash),
      non2xx: res => 'Error: ' + res.statusText,
    }).then(res => {
      console.log(res);
      let p = document.createElement('p');
      p.textContent = res;
      document.body.appendChild(p);
    });
  }
};
document.body.appendChild(input);
