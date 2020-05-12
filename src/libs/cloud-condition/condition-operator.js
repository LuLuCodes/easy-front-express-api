/**
 * Operator to be used when querying data
 */
module.exports = {
  Operator: {
    eq: 'eq', // =
    ne: 'ne', // !=
    gt: 'gt', // >
    gte: 'gte', // >=
    lt: 'lt', // <
    lte: 'lte', // <=
    or: 'or', // OR
    and: 'and', // AND
    in: 'in', // in
    notin: 'notin', // not in
    like: 'like', // like
    iLike: 'iLike', // iLike  不区分大小写
  },
  Relation_Operator: {
    and: 0,
    or: 1,
  },
  Num_Operator: {
    eq: 0, // =
    ne: 1, // !=
    gt: 2, // >
    lt: 3, // <
    gte: 4, // >=
    lte: 5, // <=
  },
  Str_Operator: {
    like: 0, // like
    iLike: 0, // like 不区分大小写
    eq: 1, // =
  },
  Date_Operator: {
    lt: 0, // <
    gt: 1, // >
  },
};
