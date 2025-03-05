export class BiMap<K, V> {
	keyToValue: Map<K, V>;
	valueToKey: Map<V, K>;

	constructor(pairs?: [K, V][]) {
		this.keyToValue = new Map<K, V>();
		this.valueToKey = new Map<V, K>();

		if (pairs) {
			pairs.forEach(([key, value]) => {
				this.set(key, value);
			});
		}
	}

	set(key: K, value: V): void {
		if (this.keyToValue.has(key)) {
			this.valueToKey.delete(this.keyToValue.get(key)!);
		}
		if (this.valueToKey.has(value)) {
			this.keyToValue.delete(this.valueToKey.get(value)!);
		}

		this.keyToValue.set(key, value);
		this.valueToKey.set(value, key);
	}

	getByKey(key: K): V | undefined {
		return this.keyToValue.get(key);
	}

	getByValue(value: V): K | undefined {
		return this.valueToKey.get(value);
	}

	hasKey(key: K): boolean {
		return this.keyToValue.has(key);
	}

	hasValue(value: V): boolean {
		return this.valueToKey.has(value);
	}

	deleteByKey(key: K): void {
		if (this.keyToValue.has(key)) {
			const value = this.keyToValue.get(key)!;
			this.keyToValue.delete(key);
			this.valueToKey.delete(value);
		}
	}

	deleteByValue(value: V): void {
		if (this.valueToKey.has(value)) {
			const key = this.valueToKey.get(value)!;
			this.valueToKey.delete(value);
			this.keyToValue.delete(key);
		}
	}
}
