const admin = require("firebase-admin");
const config = require("../util/config");
var serviceAccount = {
  type: "service_account",
  project_id: "micro-social-app",
  private_key_id: "2c4f8528e5dd276ed2a57bc860cbf1ebe8349936",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC4akXmgmNRJ2PY\nhKcI4sryXI75Sjjh1c5e9kLyoe/n9Ba8c13hQPMVCtT3U+6G4BB+DUFUqFe3ykdW\nCr26tug1EyIy6aJzb8I4SkZ7ikZfUyWCRsPpdFIjp0dB37kARcabafJQ5NmRm+9q\noemebGMGWfhqFL1RGLA83HVqoGV95Qs/X9MmhZhANPXlqoUJOZ5bhPV1itu9R+dU\nnIpLm17b9j8jaIWBDc06FkCK0i/tFjCPFqjhi6eOxMjWeunR8/ODdUHOchL8Oi2+\n8uoINqxfuyEDZqc+Rkr7TEK3qTutcB3on4hMlqcUCvtxKsxZdDoWvW6m0OdQSZwN\nYrjcZNajAgMBAAECggEAJxs2JnsI55k0RaJfr3U0dy+ki/2u0UkfIakUKlKnxqbO\nuXi3dEBrK8+nuKj+QHC8Xpad/39RVqKY/Qh7EmCeHj8n9ebwcY1GANzTVHhOkwFV\nR2qNOfDWSEQ9Sp1QJFwnkSZm4bud3ZBVNWYPXe57E0o58Pjj6pITMVzIs2s/CnKO\nc++IU361QHHuXSU7FVjCvP+Elm5ZI2w225FSpbLaVXEF4phL2GNy4Wbhin0fmLLQ\n1RGnrdYo0JWERq7tyFBbg8o4+XzI3HSUXQO+lQRFDjOIIu9nanbOSNIkA+y9Tic3\nyw0CrkXIRY1PIEOLq9eyeg1yX28LnR6mZphVX8DVcQKBgQDzFM9FfFV/GR4bzVM5\ncSeSuNe2RV7Nt6x7kvF9UxsIYUiuL3PU1Bm5r1VSBAJOSz2N+UqsX1/0NbeucVPn\n7MjP8chFW71Ch71Ii7F1dLM+BwAiHmNUsRe2AszLCQz1s0n/xi5jD7NPTmwDwtz6\nc5UqDygAntfAoShRI7gGFnk/UQKBgQDCN0smJlxBzdjvRv+jAeinIMUlXQu5slun\nJgLNZqD1xmOjb5KvPp4x1ARE6+kNMOI2lmCW/imgHxpnxF+wKvYlZjCIJVgkpFFo\nXLpGMDqteXZTpfVmNWwXxdxyykq4oPl1P+1/n1Zn/DDA/3+tKP+UCT4zVg9BQw+U\ns3p0lWpBswKBgH65XI1HEnNeLtojor2RhiXxg1Ocup3YoW0S4B6L0s39mZxlVKeh\no3+wLnTBbkpO41o+mnVei3GPB6FDp5CDWvU9gUDXYMVsanuFiBBJtKAjmigvW21t\nnYTf1NAMedslivBy6v/t0XcI1Trovbc7xonUuPAJ30SnP5N9YZSa5r7hAoGAErtk\niyRuB4bEIqf1ZhJ8DwqRGT51MA7s2h1Hbeo1Ih9lYtETE8X1Whb55m/ehYAugVdV\nr5qKB0CYumNtWz95iDfn/Gmlq7sRgwBWkwh50FuDtyOtnJMQfuZ9kbDDLjWQeeeV\nj5adrd/cD/FUri3jILMXhboKNKA0M4JwECiNHBMCgYACa7GWENbDqxTtbs0+CzDN\n0VWMDjNnEROJ1kiOE7oTpbPcaVKWt2TUHZw4WiVHB6dUb8JJMAL3WsmbueYEkWSZ\n0/K+xD55BbmuPq8hazSECtalQu+qbaEVwOk70F/T6OUf2nfOhr90r3+IZOA9XSuR\nA2QpOFaQIRSXLJmT59njRA==\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-dtyfw@micro-social-app.iam.gserviceaccount.com",
  client_id: "117242280324414355145",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-dtyfw%40micro-social-app.iam.gserviceaccount.com"
};
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://micro-social-app.firebaseio.com",
  storageBucket: config.storageBucket
});

const db = admin.firestore();
const rdb = admin.database();

module.exports = { admin, db, rdb };
