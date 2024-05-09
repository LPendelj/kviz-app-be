import { questions } from "../data/questions"

export const chooseQuestion = () => {
   let questionNumber = randomize();
   let firstQuestion = questions[questionNumber]
   return firstQuestion
}

let randomize = () => {
    return Math.ceil(Math.random()*(questions.length-1))
}