export class CondUtil {
  static diffAndVail = (bodyVal, objVal) => {
    return !!bodyVal && bodyVal !== objVal;
  };

  static setIfExists = (target, key, value) => {
    if (value != undefined && target[key] !== value) {
      target[key] = value;
    }
  };
}
