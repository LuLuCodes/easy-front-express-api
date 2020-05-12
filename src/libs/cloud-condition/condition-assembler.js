/**
 * condition 组合器
 * 说明：将前端查询中的where条件，转换成云端可以理解的condition条件
 */
const CO = require('./condition-operator');
const Op = CO.Operator;
const Num_Op = CO.Num_Operator;
const Str_Op = CO.Str_Operator;
const Date_Op = CO.Date_Operator;
const Rel_Operator = CO.Relation_Operator;

function value_tpye(param) {
  if (Object.prototype.toString.call(param) === '[object Object]') {
    let keys = Object.keys(param);
    if (keys.length === 1 && is_op(keys[0])) {
      return Op;
    } else {
      return Object;
    }
  } else if (param instanceof Date) {
    return Date;
  } else if (Number.isFinite(param)) {
    return Number;
  } else if (typeof param === 'string') {
    if (!isNaN(param)) {
      return String;
    } else {
      let value = Date.parse(param);
      if (isNaN(value)) {
        return String;
      } else if (value <= 0) {
        return String;
      } else {
        return Date;
      }
    }
  } else if (param instanceof Array) {
    return Array;
  } else {
    return undefined;
  }
}

function is_op(param) {
  return !!Op[param];
}

function number_conditin(query_key, query_value, op, type = Op.and) {
  let condition = {
    ConditionType: Rel_Operator[type],
    Operator: Num_Op[op],
    PropertyName: query_key,
    Value: query_value,
  };
  return condition;
}

function str_conditin(query_key, query_value, op, type = Op.and) {
  let condition = {
    ConditionType: Rel_Operator[type],
    Operator: Str_Op[op],
    PropertyName: query_key,
    Value: query_value,
    IgoreCase: op === Op.iLike,
  };
  return condition;
}

function array_conditin(query_key, query_value, op, type = Op.and) {
  let condition = {
    ConditionType: Rel_Operator[type],
    Operator: 0,
    PropertyName: query_key,
    Values: query_value,
    IsNot: op === Op.notin,
  };
  return condition;
}

function date_conditin(query_key, query_value, op, type = Op.and) {
  let condition = {
    ConditionType: Rel_Operator[type],
    Operator: Date_Op[op],
    PropertyName: query_key,
    Value: query_value,
  };
  return condition;
}

function op_conditin(query_key, query_value, type = Op.and) {
  let keys = Object.keys(query_value); // 获取OP，[Op.gt]: 2
  let key = keys[0];
  let value = query_value[key];
  const query_value_type = value_tpye(value);
  switch (query_value_type) {
    case Date:
      return date_conditin(query_key, value, key, type);
    case String:
      return str_conditin(query_key, value, key, type);
    case Number:
      return number_conditin(query_key, value, key, type);
    case Array:
      return array_conditin(query_key, value, key, type);
    case Op:
      return op_conditin(query_key, value, type);
    default:
      break;
  }
  return undefined;
}

module.exports = function package_conditions(where, type = Op.and) {
  let conditions = [];
  let query_keys = Object.keys(where);
  for (let query_key of query_keys) {
    if (!is_op(query_key)) {
      let condition = undefined;
      const query_value = where[query_key];
      const query_value_type = value_tpye(query_value);
      switch (query_value_type) {
        case Date:
          condition = date_conditin(query_key, query_value, Op.gt, type);
          break;
        case String:
          condition = str_conditin(query_key, query_value, Op.eq, type);
          break;
        case Number:
          condition = number_conditin(query_key, query_value, Op.eq, type);
          break;
        case Array:
          condition = array_conditin(query_key, query_value, Op.in, type);
          break;
        case Op:
          condition = op_conditin(query_key, query_value, type);
          break;
        default:
          break;
      }
      if (condition) {
        conditions.push(condition);
      }
    } else if (query_key === Op.and || query_key === Op.or) {
      let condition = undefined;
      const query_value = where[query_key];
      const query_value_type = value_tpye(query_value);
      switch (query_value_type) {
        case Object:
          condition = package_conditions(query_value, query_key);
          if (condition) {
            conditions.push(...condition);
          }
          break;
        case Array:
          {
            condition = {
              ConditionType: Rel_Operator[query_key],
              Conditions: [],
            };
            for (let item of query_value) {
              condition.Conditions.push(...package_conditions(item));
            }
            if (condition) {
              conditions.push(condition);
            }
          }
          break;
        default:
          break;
      }
    }
  }
  return conditions;
};
