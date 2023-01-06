import { ServerState } from '../mongo/state';
import { t } from '../../services/trpc';



import faqProcedures from './types/faq';

export const contentProcedures = t.router({
    faq: faqProcedures,
})
