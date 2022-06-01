import { MediaType, MediaContextType, SessionType } from "./interface";
import { base } from "./config";

const isMatch = (context: MediaContextType, m: MediaType) => {
    return context.mediaId === m.id;
}

const bind = (result: any[], mediaContexts: any[]) =>{
    return result.map((m) => {
        const contextMap = {
            back: "document-back",
            front: "document-front",
        };
        const match = mediaContexts.find((mc) => isMatch(mc, m));

        return {
            ...m,
            probability: match ? match.probability : 0,
            context: contextMap[match.context],
        };
    });
}

export class VerificationFlow {
    private actions: any[] = [];
    constructor(
        private readonly mediaContexts: MediaContextType[],
        private readonly media: MediaType[]
    ) { }

    private apply(state: {
        (result: any): any;
        (result: any): any;
        (result: any): any;
        (result: any): any;
    }) {
        this.actions.push(state);
    }

    isRear() {
        this.apply((result: any[]) =>
            result.filter((m: { context: string }) => m.context === "document-back")
        );
        return this;
    }

    isFore() {
        this.apply((result: any[]) =>
            result.filter((m: { context: string }) => m.context === "document-front")
        );
        return this;
    }

    beyondProbability(val: number) {
        this.apply((result: any[]) =>
            result.filter((m: { probability: number }) => m.probability > val)
        );
        return this;
    }

    sorter(direction: "desc" | "asc") {
        this.apply((result: any[]) => {
            return result.sort(
                (a: { probability: number }, b: { probability: number }) => {
                    if (direction === "desc") return b.probability - a.probability;
                    return a.probability - b.probability;
                }
            );
        });
        return this;
    }

    run() {
        const data = bind(this.media, this.mediaContexts);

        const result = this.actions.reduce((memo, next) => next(memo), data);

        this.actions = [];

        return result;
    }
}

export const readSession = async (sessionId: string): Promise<SessionType|{}> => {
    try {
        return await base.session(sessionId)
    } catch (e) {
        return Promise.reject(e)
    }
}

export const readMedia = async (sessionId: string): Promise<VerificationFlow> => {
    try{
        const [media, mediaContext] = [
            await base.media(sessionId).catch(() => []),
            await base.mediaContext(sessionId).catch(() => [])
        ];
        
    
        return new VerificationFlow(mediaContext,media);
    }
    catch(e){
        return Promise.reject(e)
    }
}

export default {
    readSession,
    readMedia,
};
