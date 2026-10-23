import surveyData from '@/data/survey.json';
import { SurveyConfig } from '@/lib/types';
import { SurveyShell } from '@/components/survey/SurveyShell';
import { getEnvFeatures } from '@/lib/envConfig';


export default function Home() {
  const survey = surveyData as unknown as SurveyConfig;
  const features = getEnvFeatures();

  return <SurveyShell survey={survey} initialFeatures={features} />;
}
