import { dbConn } from "../db/dbConfig.js";

export const postAnswer = async (req, res) => {
  const [question] = await dbConn.query(
    "SELECT * FROM questions WHERE id = ?",
    [req.params.questionId]
  );
  console.log("reeee", question[0]?.questionid);
  if (question.length === 0) {
    return res.status(404).send("Question not found");
  }

  if (!req.body.answer) {
    return res.status(400).send("Answer is required");
  }

  const [answer] = await dbConn.query(
    "INSERT INTO answers (answer, questionid, userid) VALUES (?,?,?)",
    [req.body.answer, question[0]?.questionid, req.user.userid]
  );

  if (answer.length === 0) {
    return res.status(500).send("Failed to post answer");
  }

  res.status(201).send("Answer posted");
};

export const getAnswers = async (req, res) => {
  const [question] = await dbConn.query(
    "SELECT * FROM questions WHERE id = ?",
    [req.params.questionId]
  );

  if (question.length === 0) {
    return res.status(404).send("Question not found");
  }

  const [answers] = await dbConn.query(
    "SELECT * FROM answers WHERE questionid = ?",
    [question[0].questionid]
  );

  answers.sort((a, b) => b.answerid - a.answerid);

  res.send(answers);
};
