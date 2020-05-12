const package_conditions = require('./condition-assembler');
const CO = require('./condition-operator');
const Op = CO.Operator;

// num = 1 and date > '2020-10-21 12:23:21' and str = '我的大是大非' and ary in [1,2,3]
// const test = {
//   num: 1,
//   date: '2020-10-21 12:23:21',
//   str: '我的大是大非',
//   ary: [1, 2, 3],
// };

// num > 2 and date < '2020-10-21 12:23:21' and str like '我的大是大非' and ary not in [1,2,3] or attr < 123
// const test = {
//   num: {
//     [Op.gt]: 2,
//   },
//   date: {
//     [Op.lt]: '2020-10-21 12:23:21',
//   },
//   str: {
//     [Op.like]: '我的大是大非',
//   },
//   ary: {
//     [Op.notin]: [1, 2, 3],
//   },
//   [Op.or]: {
//     attr: {
//       [Op.lt]: 123,
//     },
//   },
// };

// num > 2 or attr < 123 or (attr_child > 222 and attr_child1 = '123123' or attr_child3 < 123)
const test = {
  num: {
    [Op.gt]: 2,
  },
  [Op.or]: {
    attr: {
      [Op.lt]: 123,
    },
  },
  [Op.or]: [
    {
      attr_child: {
        [Op.gt]: 222,
      },
    },
    {
      attr_child1: '123123',
    },
    {
      [Op.or]: {
        attr_child3: {
          [Op.lte]: 123,
        },
      },
    },
  ],
};

console.log(JSON.stringify(package_conditions(test)));
