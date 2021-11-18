exports.getSearchObject = (reqBody) => {
  const isEmail = reqBody.email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);
  const emialOrPhone = isEmail ? 'email' : 'phone';
  const emialOrPhoneValue = reqBody.email;
  //1)check if the uer didint enter email or password

  const query = { [emialOrPhone]: emialOrPhoneValue };
  return query; // {email:"+20100514723 , password:"1236344ss"}
};
