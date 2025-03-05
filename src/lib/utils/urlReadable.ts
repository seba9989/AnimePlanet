import { BiMap } from './biMap';

export const unicodeMap = new BiMap([
	['~q', '?'],
	['~e', '!'],
	['~a', '&'],
	['~eq', '='],
	['~s', '/'],
	['~p', '%'],
	['~u', '-'],
	['_', ' ']
]);

export const encodeUrl = (url: string): string => {
	let encodedUrl = url;
	unicodeMap.valueToKey.forEach((replacement, char) => {
		encodedUrl = encodedUrl.split(char).join(replacement);
	});
	return encodedUrl;
};

export const decodeUrl = (encodedUrl: string): string => {
	let decodedUrl = encodedUrl;
	unicodeMap.keyToValue.forEach((char, replacement) => {
		decodedUrl = decodedUrl.split(replacement).join(char);
	});
	return decodedUrl;
};
