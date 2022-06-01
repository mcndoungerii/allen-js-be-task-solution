import repository, { VerificationFlow } from './repository';
import { SessionType} from './interface';

interface MediaInSession {
    front: VerificationFlow;
    back: VerificationFlow;
    session: SessionType|{};
}

export const getSessionService = async (sessionId: string): Promise<MediaInSession> => {
  
        const session = await repository.readSession(sessionId).catch(e => e.message)

        const media = await repository.readMedia(sessionId).catch(e => e.message);

        const front = media.isFore().beyondProbability(.2).sorter('desc').run()
        const back = media.isRear().beyondProbability(.2).sorter('desc').run()

        return {  front, back, session }

}