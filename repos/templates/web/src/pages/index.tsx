import { About } from '../ui/components/about';
import FrequentlyAskedQuestions from '../ui/components/faq';
import { Sponsors } from '../ui/components/sponsors';
import { LandingLayout } from '../ui/layouts/landing';


export default function Homepage() {
    return <LandingLayout>
        <About />
        <Sponsors />
        <FrequentlyAskedQuestions />
        <FrequentlyAskedQuestions />
        <FrequentlyAskedQuestions />
        <FrequentlyAskedQuestions />
    </LandingLayout>
}