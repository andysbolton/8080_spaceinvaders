var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
// @flow
import Uint8 from './Uint8';
import { toBit } from './Bit';
var ConditionCodes = /** @class */ (function () {
    function ConditionCodes() {
        this.z = 0;
        this.s = 0;
        this.p = 0;
        this.cy = 0;
        this.ac = 0;
        this.pad = 0;
    }
    ConditionCodes.prototype.getPsw = function () {
        var val = this.s + this.z + '0' + this.ac + '0' + this.p + '1' + this.cy;
        return new Uint8(parseInt(val, 2));
    };
    ConditionCodes.prototype.setPsw = function (n) {
        var binary = n
            .val()
            .toString(2)
            .padStart(8, '0');
        var _a = __read(binary.split('').map(function (s) { return Number(s); }), 8), s = _a[0], z = _a[1], ac = _a[3], p = _a[5], cy = _a[7];
        this.s = toBit(s);
        this.z = toBit(z);
        this.ac = toBit(ac);
        this.p = toBit(p);
        this.cy = toBit(cy);
    };
    return ConditionCodes;
}());
export default ConditionCodes;
//# sourceMappingURL=ConditionCodes.js.map