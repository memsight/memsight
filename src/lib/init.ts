export function init() {
    BigInt.prototype.toJSON = function () {
        return parseInt(this.toString())
    }
}