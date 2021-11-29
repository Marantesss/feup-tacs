/*
 * 'Origami Programming' by Hugo Sereno Ferreira
 *
 * IEEE Talk @ FEUP (2018)
 *
 * Exercise sheet (http://goo.gl/Dd4p7b)
 *
 * Note: Make sure you have node.js, and then install the dependencies using:
 *
 * npm install -g lodash
 *
 * For a Live Programming experience, use the Quokka plugin (https://quokkajs.com) with VSCode (https://code.visualstudio.com)
 */

// region Preamble
const eq = require('lodash').isEqual
// endregion

// region Basic example

const a = [1, 2, 3, 4, 5]
let s = 0
for (let i = 0; i < a.length; i++)
    s += a[i]

s

a.reduce((s, step) => s + step)  //?


// endregion

// region Basic example with strings

const sin = ['To', ' be', ' or', ' not', ' to', ' be!']
let sout = ''
for (let i = 0; i < sin.length; i++)  // a bug lies here!
    sout += sin[i]

sout

sin.reduce((sout, step) => sout + step)  //?

// endregion

// region Filtering even array elements

const b = [1, 2, 3, 4, 5, 6]
let filtered = Array()
for (let i = 0; i < b.length; i++)
    if (b[i] % 2 == 0) filtered.push(b[i])

filtered

//b.reduce((filtered, step) =>  (step % 2 == 0)?filtered.push(step), [])  //?

// endregion

// region Base definition of fold

const fold = (as, base) => (f) => {
    let result = base
    for (let i = 0; i < as.length; i++)
        result = f(result, as[i])
    return result
}

// endregion

// region sum = [as] => Integer

const sum = (as) => as.reduce((initial, step) => initial + step,0);

sum([1, 2, 3]) === 6 //?
sum([]) === 0        //?

// endregion

// region foreach = [a] => (a => void) => void
const foreach = (as) => (f) => null

const farr = new Array()
foreach([1, 2, 3])(e => farr.push(e))
eq(farr, [1, 2, 3]) //?
// endregion

// region map = [a] => (a => b) => [b]
const map = (as) => (f) => null

eq(map([1, 2, 3])(e => e + 1), [2, 3, 4]) //?
eq(map([])(x => x + 5), []) //?

// endregion

// region filter = [a] => (a => bool) => [a]
const filter = (as) => (f) => null

eq(filter([1, 2, 3, 4, 5, 6])(e => e % 2), [1, 3, 5]) //?
eq(filter([1, 2, 3, 4, 5, 6])(e => e % 2 == 0), [2, 4, 6]) //?
// endregion

// region filterNot = [a] => (a => bool) => [a]
const filterNot = (as) => (f) => null

eq(filterNot([1, 2, 3, 4, 5, 6])(e => e % 2), [2, 4, 6]) //?
eq(filterNot([1, 2, 3, 4, 5, 6])(e => e % 2 == 0), [1, 3, 5]) //?
// endregion

// region exists = [a] => (a => bool) => bool
const exists = (as) => (f) => null

exists([1, 2, 3])(e => e == 3) === true //?
exists([1, 2, 3])(e => e > 2) === true//?
exists([1, 2, 3])(e => e == 5) === false //?
// endregion

// region forall = [a] => (a => bool) => bool
const forall = (as) => (f) => null

forall([1, 2, 3])(e => e < 4) === true //?
forall([1, 2, 3])(e => e > 4) === false //?
forall([])(e => e > 5) === true //?
// endregion

// region length = [a] => Integer
const length = (as) => null

length([1, 2, 3]) == 3 //?
length([]) == 0 //?
// endregion

// region isEmpty = [a] => bool
const isEmpty = (as) => null
// const isEmpty = (as) => length(as) == 0

isEmpty([]) === true //?
isEmpty([1, 2, 3]) === false //?
// endregion

// region notEmpty = [a] => bool
const notEmpty = (as) => null
// const isEmpty = (as) => length(as) != 0

notEmpty([]) === false //?
notEmpty([1, 2, 3]) === true //?
// endregion

// region reverse = [a] => [a]
const reverse = (as) => null

eq(reverse([1, 2, 3]), [3, 2, 1]) //?
eq(reverse([]), []) //?
// endregion

// region first = [a] => a ?
const first = (as) => null

first([1, 2, 3]) === 1 //?
first([]) === null //?
// endregion

// region last = [a] => a ?
const last = (as) => null

last([1, 2, 3]) === 3 //?
last([]) === null //?
// endregion

// region tail = [a] => [a]
const tail = (as) => null

eq(tail([1, 2, 3]), [2, 3]) //?
eq(tail([2, 3]), [3]) //?
eq(tail([3]), []) //?
eq(tail([]), []) //?
// endregion

// region second = [a] => a ?
const second = (as) => null

second([1, 2, 3]) === 2 //?
second([1]) === null //?
second([]) === null //?
// endregion

// region max = [a] => a
const max = (as) => null

max([1, 2, 3]) === 3//?
max([1]) === 1//?
max([]) === null //?
// endregion

// region maxBy = [a] => (a => b) => a
const maxBy = (as) => (f) => null

eq(maxBy([{a: 1}, {a: 2}, {a: 3}])(e => e.a), {a: 3}) //?
// endregion

// region min = [a] => a
const min = (as) => null

min([1, 2, 3]) === 1//?
min([1]) === 1//?
min([]) === null //?
// endregion

// region minBy = [a] => (a => b) => a
const minBy = (as) => (f) => null

eq(minBy([{ a: 1 }, { a: 2 }, { a: 3 }])(e => e.a), { a: 1 }) //?
// endregion

// region find = [a] => (a => bool) => a?
const find = (as) => (f) => null

eq(find([{ name: 'quim', age: 2 }, { name: 'tostas', age: 3 }], e => e.age == 3), { name: 'tostas', age: 3 }) //?
find([{ name: 'quim', age: 2 }], e => e.age == 52) === null //?
// endregion

// region takeWhile = [a] => (a => bool) => [a]
const takeWhile = (as) => (f) => null

eq(takeWhile([1, 2, 3, 4, 5], e => e <= 2), [1, 2]) //?
// endregion

// region dropWhile = [a] => (a => bool) => [a]
const dropWhile = (as) => (f) => null

eq(dropWhile([1, 2, 3, 4, 5], e => e <= 2), [3, 4, 5]) //?
// endregion

// region partition = [a] => (a => bool) => ([a], [a])
const partition = (as) => (f) => null

eq(partition([1, 2, 3, 4], e => e % 2), [[1, 3], [2, 4]]) //?
// endregion

// region splitAt = [a] => Integer => ([a], [a])
const splitAt = (as) => (i) => null

eq(splitAt([1, 2, 3], 2), [[1, 2], [3]]) //?
// endregion

// region zip = [a] => [b] => [(a, b)]
const zip = (as) => (bs) => null

eq(zip([1, 2, 3], ['a', 'b', 'c']), [[1, 'a'], [2, 'b'], [3, 'c']]) //?
// endregion

// region zipWithIndex = [a] => [(Integer, b)]
const zipWithIndex = (as) => null

eq(zipWithIndex(['a', 'b', 'c']), [['a', 0], ['b', 1], ['c', 2]]) //?
// endregion

// region index = [a] => Integer => a?
const index = (as) => (i) => null

index(['a', 'b', 'c'], 0) === 'a' //?
index([1, 2, 3], 1) === 2 //?
// endregion

// region indexWhere = [a] => (a => bool) => Integer?
const indexWhere = (as) => (f) => null

indexWhere(['a', 'b', 'c'], e => e == 'b') === 1 //?
indexWhere(['a', 'b', 'c'], e => e == 'd') === null //?
// endregion

// region take = [a] => Integer => [a]
const take = (as) => (i) => null

eq(take(['a', 'b', 'c'], 2), ['a', 'b']) // ?
eq(take(['a', 'b', 'c'], 5), ['a', 'b', 'c']) // ?
eq(take(['a', 'b', 'c'], 0), []) // ?
// endregion

// region drop = [a] => Integer => [a]
const drop = (as) => (i) => null

eq(drop(['a', 'b', 'c'], 2), ['c']) // ?
eq(drop(['a', 'b', 'c'], 5), []) // ?
eq(drop(['a', 'b', 'c'], 0), ['a', 'b', 'c']) // ?
// endregion