'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Alex Radu',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Grișa Rusu',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = ` 
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}€</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//displayMovements(account1.movements);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} EUR`;
};

//calcDisplayBalance(account1.movements);

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter((int, i, arr) => {
      //console.log(arr);
      return int > 1;
    })
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interest}€`;
};
//calcDisplaySummary(account1.movements);

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  //Display movements
  displayMovements(acc.movements);
  //Display balance
  calcDisplayBalance(acc);
  //Display summary
  calcDisplaySummary(acc);
};

//Event handlers
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  //Prevent form from submitting (not auto-refresh)
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  //optional chaining (?.)
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and welcome  message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  //console.log(amount, receiverAcc);
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //console.log('transfer valid');
    //Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Update the UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //Add movement
    currentAccount.movements.push(amount);
    //Update UI
    updateUI(currentAccount);
    inputLoanAmount.value = '';
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    //console.log(index);
    //Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
  }
  inputClosePin.value = inputCloseUsername.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
/*
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

let arr = ['a', 'b', 'c', 'd', 'e'];

//slice method
arr.slice(2);
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(1, -1));
//shallow copies
arr.slice();
[...arr];

//splice method - it mutates the original array
//console.log(arr.splice(2));
console.log(arr);
arr.splice(-1);
arr.splice(1, 2);
console.log(arr);

//reverse method - it mutates the original array

arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];

console.log(arr2.reverse());

//concat method

const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]);

//join
 
console.log(letters.join(' - '));


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

for (const [i, movement] of movements.entries()) {
  if (movement > 0) console.log(`Movement ${i + 1}: You deposited ${movement}`);
  else console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
}
console.log('-----FOREACH------');
//forEach method - runs a function for each iteration
//ORDER - value, index, the array that is looped over
movements.forEach(function (movement, index, array) {
  if (movement > 0)
    console.log(`Movement ${index + 1}:You deposited ${movement}`);
  else console.log(`Movement ${index + 1}:You withdrew ${Math.abs(movement)}`);
});

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR']);

currenciesUnique.forEach(function (value, key, set) {
  console.log(`${key}: ${value}`);
});


const dogsJulia = [4, 5, 65, 54, 765, 2, 3, 5];
const dogsKate = [2, 5, 4, 1, 5, 7];

const checkDogs = function (dogsJulia, dogsKate) {
  //could have used slice() and the splice(0,1) and splice(-2)
  const correctDogsJulia = dogsJulia.slice(1, -2);
  console.log(correctDogsJulia);
  const showDog = function (dog, i) {
    console.log(
      dog < 3
        ? `Dog number ${i + 1} is still a puppy`
        : `Dog number ${i + 1} is ${dog} years old`
    );
  };
  console.log(`Julia's Dogs`);
  correctDogsJulia.forEach(showDog);
  console.log(`Kate's Dogs`);
  dogsKate.forEach(showDog);
};

checkDogs(dogsJulia, dogsKate);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurToUsd = 1.1;

const movementsUsd = movements.map(function (mov) {
  return mov * eurToUsd;
});

console.log(movements);
console.log(movementsUsd);

const movementsUsdFor = [];
for (const mov of movements) {
  movementsUsdFor.push(mov * eurToUsd);
}

console.log(movementsUsdFor);

const movementsUsdArrow = movements.map(mov => mov * eurToUsd);

console.log(movementsUsdArrow);

const movementDescriptions = movements.map(
  (mov, i) =>
    `Movement ${i + 1}:You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
      mov
    )}`
);

console.log(movementDescriptions);


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
//FILTER method. returns a boolean
const deposits = movements.filter(function (mov) {
  return mov > 0;
});

console.log(deposits);

const depositsFor = [];
for (const mov of movements) if (mov > 0) depositsFor.push(mov);
console.log(depositsFor);

//using arrow functions
const withdrawals = movements.filter(mov => mov < 0);

console.log(withdrawals);


//REDUCE method
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//First argument is the accumulator - like a snowball
// const balance = movements.reduce(function (acc, currentElement, i) {
//   console.log(`Iteration ${i}: ${acc}`);
//   return acc + currentElement;
// }, 0);

const balance = movements.reduce(
  (acc, currentElement, i) => acc + currentElement,
  0
);
console.log(balance);

let balance2 = 0;
for (const mov of movements) balance2 += mov;
console.log(balance2);

//maximum value of movements

const max = movements.reduce((acc, val, i) => (val > acc ? val : acc), 0);
console.log(max);


const calcAverageHumanAge = function (dogs) {
  const dogAges = dogs
    .map(dogAge => (dogAge <= 2 ? dogAge * 2 : 16 + dogAge * 4))
    .filter(dogAge => dogAge >= 18);
  return dogAges.reduce((avg, dogAge, i, arr) => avg + dogAge) / dogAges.length;
};

console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));

const calcAverageHumanAge2 = function (dogs) {
  const dogAges = dogs
    .map(dogAge => (dogAge <= 2 ? dogAge * 2 : 16 + dogAge * 4))
    .filter(dogAge => dogAge >= 18)
    .reduce((avg, dogAge, i, arr) => avg + dogAge / arr.length, 0);
  return dogAges;
};

console.log(calcAverageHumanAge2([5, 2, 4, 1, 15, 8, 3]));


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const eurToUsd = 1.1;

//PIPELINE
const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map((mov, i, arr) => {
    console.log(arr);
    return mov * eurToUsd;
  })
  .reduce((sum, mov) => sum + mov, 0);

console.log(totalDepositsUSD);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const firstWithdrawal = movements.find(mov => mov < 0);

console.log(firstWithdrawal);

console.log(accounts);

const account = accounts.find(acc => (acc.owner = 'Jessica Davis'));
console.log(account);


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements);

//EQUALITY
console.log(movements.includes(-130));

//SOME: CONDITION
console.log();
movements.some(mov => mov === -130);
const anyDeposits = movements.some(mov => mov > 5550);

console.log(anyDeposits);

//EVERY: CONDITIONS
console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

//Separate callback
const deposit = mov => mov > 0;

console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));


const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [[4, 5], 6], 7, 8];
console.log(arrDeep.flat(2)); // argument is the depth

//flat
const overallBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);

console.log(overallBalance);

//flatMap
const overallBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);

console.log(overallBalance2);
*/

const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort()); //MUTATES THE ORIGINAL ARRAY
console.log(owners);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

console.log(movements);

//return <-0, A, B (keep order)
//return >0, B, A (switch order)
//ASCENDING
movements.sort((a, b) => {
  if (a > b) return 1;
  else return -1;
});
console.log(movements);
//DESCENDING
movements.sort((a, b) => {
  if (a > b) return -1;
  else return 1;
});
console.log(movements);

//ASCENDING - IMPROVED
movements.sort((a, b) => a - b);
console.log(movements);
//DESCENDING - IMPROVED
movements.sort((a, b) => b - a);
console.log(movements);
