type Guid = string;
type ContextType = "back" | "front" | "none";
type DocumentContextType = "document-front" | "document-back";
type MimeType = "image/png";
type ProbabilityType = number;

export interface SessionType {
    id: Guid,
    status: string
}

export interface SessionTypeResponse {
    data: SessionType
}

export interface MediaType {
    context: DocumentContextType,
    id: Guid,
    mimeType: MimeType
}

export interface MediaTypeResponse {
   data: MediaType[]
}

export interface MediaContextType {
    context: ContextType,
    id: Guid,
    mediaId: Guid,
    probability: ProbabilityType
}

export interface MediaContextTypeResponse {
    data: MediaContextType[]
}

export interface ApiType {
   session(sessionId: Guid) : Promise<SessionType>;
   mediaContext(sessionId: Guid): Promise<MediaContextType[]|[]>;
   media(sessionId: Guid): Promise<MediaType[]|[]>;
}