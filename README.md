# Code Audit

There's only one change in the underlying library, you can see it with

`diff <(curl https://raw.githubusercontent.com/mdp/gibberish-aes/master/src/gibberish-aes.js) <(cat gibberish-aes.js)`


# Install and run with Docker

- Update attempt.js with your encryption key and passcode
- `docker build . -t kdebug`
- `docker run -rm kdebug`
