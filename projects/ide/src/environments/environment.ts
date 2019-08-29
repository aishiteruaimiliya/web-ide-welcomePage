// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// https://www.codercto.com/a/7019.html
// ng serve 或 ng build
export const environment = {
  production: true,

  // url of development api
  lcmUrl: '/',
  // lcmUrl: 'http://localhost:5000/',
  // lcmUrl: 'http://10.24.11.159:5000',
  // SERVER_IP: 'http://10.24.12.129:5000'
  SERVER_IP: ''
};
