'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Vijay Sharma',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Deepshi Sharma',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Sangeeta Sharma',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Mamta Sharma',
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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
// for simple Array, foreach syntax is forEach((iter, index, arr))
// forEach has a syntax arr.forEach((key, value, arr)=>{ body })
// arr can be simple array, set or a map.
// display transactions in rows

const displayRecords = (movements, sort = false) => {

  containerMovements.innerHTML = ''
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach((movement, index) => {
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const html = `
<div class="movements__row">
<div class="movements__type movements__type--${type}">${index + 1} ${type}</div>
<div class="movements__date">3 days ago</div>
<div class="movements__value">${movement}€</div>
</div>
`
    containerMovements.insertAdjacentHTML('afterbegin', html)
  })
}
// displayRecords(account1.movements)
// Creating username from name entered in input field
const createUsernames = function (acc) {
  acc.forEach((account) => {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  })
}
createUsernames(accounts)
const UIUpdate = function (acc) {
  // display movements
  displayRecords(acc.movements)
  // display balance
  calculatePrintBalance(acc)
  // display summary
  calcDisplaySummary(acc)
}
// console.log(accounts)
const calculatePrintBalance = function (account) {
  account.balance = account.movements.reduce((acc, curr) => {
    console.log(acc)
    return acc + curr
  }, 0)
  labelBalance.textContent = `${account.balance}€`
}



const calcDisplaySummary = function (account) {
  const income = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income}€`
  const out = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0)
  labelSumOut.textContent = `${Math.abs(out)}€`
  // In our fictional bank, interest is paid on every deposit :)
  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => deposit * account.interestRate / 100)
    .filter((int, i, arr) => {
      console.log(arr, 'filtered')
      return int >= 1
    })
    .reduce((acc, int) => acc + int, 0)
  labelSumInterest.textContent = `${interest}€`
}

// Event Handlers for logging in
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  // prevent default behaviour of browser of refreshing page on form submission
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value)
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // clear input fields
    inputLoginUsername.value = inputLoginPin.value = ''
    inputLoginPin.blur()
    // display ui and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`
    containerApp.style.opacity = 100;
    // update ui
    UIUpdate(currentAccount)
  }
})

// Transfer money
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault()
  const amount = Number(inputTransferAmount.value)
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value)
  inputTransferAmount.value = inputTransferTo.value = ''
  if (amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.usename !== currentAccount.username) {
    // doing the transfer
    currentAccount.movements.push(-amount)
    receiverAcc.movements.push(amount)

    // update ui
    UIUpdate(currentAccount)
  }
  inputLoanAmount.value = ''
})

btnLoan.addEventListener('click', function (e) {
  e.preventDefault()
  const loanAmount = Number(inputLoanAmount.value)
  if (loanAmount > 0 && currentAccount.movements.some(mov => mov >= 0.1 * loanAmount)) {
    // add movement
    currentAccount.movements.push(loanAmount)
    // update ui
    UIUpdate(currentAccount)
  }
})

// close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault()
  if (inputCloseUsername.value === currentAccount.username
    && Number(inputClosePin.value) === currentAccount.pin) {
    const position = accounts.findIndex(acc => acc.username === currentAccount.username)
    // console.log('pos', position)

    // delete account
    accounts.splice(position, 1)

    // hide UI
    containerApp.style.opacity = 0
  }
  inputCloseUsername.value = inputClosePin.value = ''
})

// sorting the transactions
let sorted = false
btnSort.addEventListener('click', function (e) {
  e.preventDefault()
  displayRecords(currentAccount.movements, !sorted)
  sorted = !sorted;
})
/////////////////////////Lectures////////////
// calculatePrintBalance(account1.movements)
const arr = [1, 2, 3, 4, 5, 6, 7]
arr.reduce((acc, curr, index, arr) => {
  // console.log(acc, curr, index, arr.length)
  return acc + curr / arr.length
}, arr[0])
// calcDisplaySummary(account2.movements)


// forEach creates side effects while maop returns result as a part of action that is performed in callback
// pipeline for converting euros to usd
const eurToUsd = 1.1
const totalDepositUSD = movements.filter(mov => mov < 0).map((mov, i, arr) => {
  // console.log(arr)
  return eurToUsd * mov
}).reduce((acc, mov) => acc + mov, 0);
// console.log('usd', totalDepositUSD)

// flatMap (combination of map and then applying flat on it)
// by default flat method works one level deep only.
// sort function
const owners = ['Deepshi', 'Vijay', 'Sangeeta', 'Mamta', 'Vanshu']
console.log(owners.sort((a, b) => a < b))
