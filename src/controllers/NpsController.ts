import { Request, Response } from 'express'
import { getCustomRepository, Not, IsNull } from 'typeorm'
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';

class NpsController {

    async execute(request: Request, response: Response) {

        const { survey_id } = request.params;

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const surveyAnswers = await surveysUsersRepository.find({
            survey_id,
            value: Not(IsNull())
        })

        const detractors = surveyAnswers.filter(survey =>
            (survey.value >= 0 && survey.value <= 6)
        ).length;

        const promoters = surveyAnswers.filter(survey =>
            (survey.value >= 9)
        ).length;

        const passive = surveyAnswers.filter(survey =>
            (survey.value >= 7 && survey.value <= 8)
        ).length;

        const totalAnswers = surveyAnswers.length;

        const calculate = Number((((promoters - detractors) / totalAnswers) * 100).toFixed(2));

        return response.json({
            detractors,
            promoters,
            passive,
            totalAnswers,
            nps: calculate
        })
    }
}

export { NpsController }