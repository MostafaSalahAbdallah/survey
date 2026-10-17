import surveyData from '@/data/survey.json';
import { SurveyConfig } from '@/lib/types';
import { SurveyShell } from '@/components/survey/SurveyShell';

export default function Home() {
  const survey = surveyData as unknown as SurveyConfig;

  return <SurveyShell survey={survey} />;
}
