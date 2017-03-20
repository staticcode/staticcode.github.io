
const numberWithSpaces = (x, separator = ' ') => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);

export default numberWithSpaces;
