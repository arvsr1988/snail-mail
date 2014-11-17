module.exports = {
    getUniqueItems: function (fromArray) {
        var seen = {};
        return fromArray.filter(function (item) {
            return seen.hasOwnProperty(item) ? false : (seen[item] = true);
        });
    }
};