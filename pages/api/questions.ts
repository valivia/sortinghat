import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";

const questionFile = JSON.parse(fs.readFileSync(`${process.cwd()}/public/questions.json`).toString());

export default async function questions(req: NextApiRequest, res: NextApiResponse) {

  const max = [0, 0, 0, 0];
  const min = [0, 0, 0, 0];
  const courses = ["BDAM", "FICT", "SE", "IAT"];
  const results = [];
  const input = req.body.result;

  for (let group = 0; group < max.length; group++) {
    let score = 0;

    for (const question of questionFile) {
      let highest = 0;
      let lowest = 999;
      for (const option of question.options) {
        const list = option.value.split("/");
        const num = Number(list[group]);
        if (num > highest) highest = num;
        if (num < lowest) lowest = num;
      }

      max[group] += highest;
      min[group] += lowest;
    }

    for (const q of input) {
      score += Number(q.split("/")[group]);
    }

    const percentage = (score / max[group]).toFixed(4);

    results.push({ name: courses[group], percentage: percentage, min: min[group], max: max[group], score: score });

  }


  res.json(results);
}