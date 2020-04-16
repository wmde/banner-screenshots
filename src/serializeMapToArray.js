export function serializeMapToArray(key, value) {
	const originalObject = this[key];
	if(originalObject instanceof Map) {
		return Array.from( originalObject.entries() );
	} else {
		return value;
	}
}