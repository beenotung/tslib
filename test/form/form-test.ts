import { postMultipartFormData } from '../../src/form';

postMultipartFormData('http://47.75.61.98:8080/fdcore_user/fdcore_user_ser.php', {
  service: 'tryemail_reglogin', data: {
    appid: 3,
    email: 'beeno@freedomdragon.ltd',
  },
})
  .then(res => {
    console.log('response:', Object.keys(res));
    console.log('status:', res.status);
    console.log('statusText:', res.statusText);
    console.log('data:', res.data);
  })
  .catch(e => console.error({ e }));
