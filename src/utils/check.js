export const is_number = (arg) => {
	return (typeof arg) == 'number' ? true : false;
};

export const is_string = (arg) => {
	return (typeof arg) == 'string' ? true : false;
};

export const is_function = (arg) => {
	return (typeof arg) === 'function' && Object.getPrototypeOf(arg) === Function.prototype;
};

export const is_async_function = (arg) => {
	return (typeof arg) === 'function' && arg.constructor && arg.constructor.name === "AsyncFunction"
};
