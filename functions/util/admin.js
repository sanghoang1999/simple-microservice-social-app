const admin = require("firebase-admin");
const config = require("../util/config");
var serviceAccount = {
  type: "service_account",
  project_id: "social-app-f685d",
  private_key_id: "d8d8c0cbdafd92126faf7fc82c3a2b489eabdd58",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQClW+O0ZzdNHdkg\nsk2k2NPIfKVdYvKD9s58sgTSejxAvCF2rdeqKFa9AlgsTbJsFo0ai6+SyspE23oz\nINaPFhJSupl80OrX1wzOIpkz+XqRbtGGwEuhYTPhNpUd5hhOjOb8jHYzoKjrZvST\nAi8xMKHOHsstKgudCu/JkVV6FvHQmr6IZeNyDAFfZmP090PlFMtsY5tJ+t4o0sRL\ns3x0ecnQrQ2lLP+sJe4OU7xKVIscDalvHA4MsaUpovEfyopwZ+VtFz8Sq5KpiGEx\n2aDrXas0AwOIYc2r0YevvmaU4kTLTtnfPtpwtIlYitRuBPOACtCJxWcYQvmE9Y1x\nCE2h+G5FAgMBAAECggEAF9pYehaFg1SclJCD42qk/3+ozv7N+Dvq71EyoYtLvml6\nSPICG86JLJH2VssNGMsWpvn4EAG8CbtrNjg0xcaA9XlrWKDpBMzwUO/sD55GOve0\nYRluD3puZGdePUY1bWdP4/r9tgF6kcfJMfJCYnh0br+XFA3DnRoNxZLMX2SIlKGc\nwUT67kgqvm9S+l91lDdhFQgdYbbWGrxpH/z7FxTmxEcEnCMVbj2U7JLzV198MqNP\n5b1qUYdh1zWlZC/EG8Y86hNndfnv9l6qrgtMi0yy4Tmhsfv3GBxZ7lA53TdcAnbd\nzGtVsuWAlWDZAD4orMP/rUolyScDNNCt9RSDuFycRQKBgQDmTgGWUPOruEJApAZ7\nYT4thobE9wKC6+fX04T7LGbp+TZFigBxDNoz8dcJAqGRQWT7GVovDPM4iZvmxNZu\n9DHqAaBXjZ9Ar/UICnYmByP5nwgVwzUovi8LbXoZ7C+it2ZtVEPwr8Ls91974FIT\nXxx7Dz7CzbR9rrG8XveEeZe9swKBgQC3zuTCvwmqdVu4iobU7RjmMFpUhyfEtLZS\nNtO7i7fo3QDIEyq1mU1IvAZGcrS6z1Nt8Ezb97WYbsG+9i17D5zpFBj6dLxLCMSm\nSLAXA+3GsBvlSWT59KUu5JhCSysaekxyxb94dME+NaQXhjhxS2aAHvUBqXwIbdc1\nC5ueUkdYJwKBgDSuHUDUDZj3EfiVTIJGcSGaxxMg6WsnKSY+VQnbU0Mr5VUsxwMV\nDIibRjPibTC7w6yIVQ+0J6KEH6w+1EoXA5/idVnxpD74wNTxB6uVMI516TSJLYy/\nTCWSCj8Jvq+6wew6PTw+CBmKUEYWvs99jxc7GoEW6rVhE3jiRD4CTkpvAoGBAJ0q\ntYSoITW139Wt7ZiHm7DIS5TXdHPIKdWmt+k3kOv2fUKW0QAys1isHZmDX3IU8Tui\nK7Yy2v4aRmRoz37YXM0XuDwAMTjfqHae1KL5YwlvcIrf9Q2d2Nh98otNBvA+/rts\nx0nSW6I777GFvSFy3ZRT5B+lsj7q3Qeog0ofBI4lAoGBAImtNsskJosEonP8CQIK\nwVswqLC+Au9K4JCLoBXdOVXM8HbAwwmPXzfEGx70yxw10iOzFIKvl1o10REAobsY\n8edyV/WcsSl71rjjI0FQ+mzhq6Mb2tJIphWDkGR3uzVmv/1d3cMpQ2RRtQ+3Mvpj\nRZKvKdCW1L2lQjA6IVxf0heD\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-psjk9@social-app-f685d.iam.gserviceaccount.com",
  client_id: "107432700337336945040",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-psjk9%40social-app-f685d.iam.gserviceaccount.com"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://social-app-f685d.firebaseio.com",
  storageBucket: config.storageBucket
});

const db = admin.firestore();

module.exports = { admin, db };
