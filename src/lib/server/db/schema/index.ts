import type { Prettify } from '$lib/types/pretty';
import type { CreateDownload, Download } from './download';
import type { CreateVideo, Video } from './video';

export * from './anime';
export * from './download';
export * from './episode';
export * from './group';
export * from './relations';
export * from './role';
export * from './session';
export * from './tag';
export * from './user';
export * from './video';

export type Link = Prettify<Video & Download>;
export type CreateLink = Prettify<CreateVideo & CreateDownload>;
