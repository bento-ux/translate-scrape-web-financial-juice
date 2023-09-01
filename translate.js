const translate = require('@iamtraction/google-translate');

translate('mergo tresno', { to: 'en' }).then(res => {
    console.log(res.text); // OUTPUT: You are amazing!
  }).catch(err => {
    console.error(err);
  });