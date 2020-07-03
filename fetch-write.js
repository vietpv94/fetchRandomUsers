const fs = require("fs");
const request = require("request");
const questions = [
  "File output's name?",
  "How many random user do you want to create?",
];

const ask = (i = 0) => {
  process.stdout.write(`\n\n\n ${questions[i]}`);
  process.stdout.write(` > `);
};

ask();

const getRandomUser = function (i) {
  return new Promise((resolve) => {
    request("https://randomuser.me/api", function (err, res, body) {
      //nếu có lỗi
      if (err) return;
      // console.log(body);
      const result = JSON.parse(body)["results"][0];
      result["id"] = i;
      resolve(result);
    });
  });
};

function asyncCall(numberOfUser) {
  const promises = [];
  for (let i = 0; i < parseInt(numberOfUser) - 1; i++) {
    promises.push(getRandomUser(i));
  }
  return promises;
}

asyncCall();
const answers = [];
process.stdin.on("data", (data) => {
  answers.push(data.toString().trim());
  if (answers.length < questions.length) {
    ask(answers.length);
  } else {
    const [fileName, numOFUser] = answers;

    Promise.all(asyncCall(numOFUser)).then((values) => {
      fs.writeFile(
        fileName + ".json",
        JSON.stringify(values),
        "utf8",
        function (err) {
          if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
          }

          console.log("JSON file has been saved.");

          process.exit();
        }
      );
    });
  }
});
