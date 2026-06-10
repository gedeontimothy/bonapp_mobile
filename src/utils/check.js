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

export const is_object = (arg) => {
	return arg instanceof Object && !is_array(arg) && !is_function(arg);
};

export const is_array = (arg) => {
	return Array.isArray(arg);
};
