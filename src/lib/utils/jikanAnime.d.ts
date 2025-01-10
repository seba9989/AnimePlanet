export interface Anime {
	pagination: Pagination;
	data: AnimeData[];
}

export interface AnimeData {
	mal_id: number;
	url: string;
	images: Images;
	approved: boolean;
	title: string;
	title_english?: string;
	title_japanese: string;
	title_synonyms: string[];
	type: string;
	source: string;
	episodes?: number;
	status: string;
	airing: boolean;
	duration: string;
	rating?: string;
	score?: number;
	scored_by?: number;
	rank?: number;
	popularity: number;
	members: number;
	favorites: number;
	synopsis?: string;
	background: string;
	season?: string;
	year?: number;
}

export interface Images {
	webp: Webp;
}

export interface Webp {
	image_url: string;
	small_image_url: string;
	large_image_url: string;
}

export interface Episodes {
	pagination: Pagination;
	data: EpisodeData[];
}

export interface Pagination {
	last_visible_page: number;
	has_next_page: boolean;
}

export interface EpisodeData {
	mal_id: number;
	url: string;
	title: string;
	title_japanese?: string;
	title_romanji?: string;
	aired: string;
	score: number;
	filler: boolean;
	recap: boolean;
	forum_url: string;
}
