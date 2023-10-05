"use strict";
// Labels
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
const warningText = document.querySelector('.warning-text');
// Containers
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const loginForm = document.querySelector('.login');
const navContainer = document.querySelector('.login-nav');
const loginTooltip = document.querySelector('.tooltip');
// Buttons
const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const btnLogout = document.querySelector('.logout');
// Inputs
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--password');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
// Implement Login
let currentAccount, timing;
// Loan
let amount;
// Sort movements
let sorted = false;
const accounts = [{
        owner: 'Walter White',
        movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
        interestRate: 1.2,
        pin: 1111,
        movementsDates: [
            '2019-11-18T21:31:17.178Z',
            '2019-12-23T07:42:02.383Z',
            '2020-01-28T09:15:04.904Z',
            '2020-04-01T10:17:24.185Z',
            '2021-05-08T14:11:59.604Z',
            '2021-07-25T17:01:17.194Z',
            '2021-07-21T23:36:17.929Z',
            '2021-07-12T10:51:36.790Z',
        ],
        currency: 'EUR',
        locale: 'pt-PT',
    },
    {
        owner: 'Jesse Pinkman',
        movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
        interestRate: 1.5,
        pin: 2222,
        movementsDates: [
            '2019-11-01T13:15:33.035Z',
            '2019-11-30T09:48:16.867Z',
            '2019-12-25T06:04:23.907Z',
            '2020-01-25T14:18:46.235Z',
            '2020-02-05T16:33:06.386Z',
            '2021-04-10T14:43:26.374Z',
            '2021-06-25T18:49:59.371Z',
            '2021-07-26T12:01:20.894Z',
        ],
        currency: 'USD',
        locale: 'en-US',
    }];
const formatMovementDate = function (date) {
    const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
    const currentDate = new Date().getTime(); // Convert current date to milliseconds
    const targetDate = date.getTime(); // Convert the input date to milliseconds
    const daysPassed = calcDaysPassed(currentDate, targetDate);
    if (daysPassed === 0)
        return 'Today';
    if (daysPassed === 1)
        return 'Yesterday';
    if (daysPassed <= 7)
        return '${daysPassed} days ago';
    else {
        const day = `${date.getDate()}`.padStart(2, '0');
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
};
const formatCurrency = function (value, locale, currency) {
    //Format currency
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(value);
};
const displayMovements = function (acc, sort = false) {
    containerMovements.innerHTML = '';
    //sort movemenets
    const movs = sort
        ? acc.movements.slice().sort((a, b) => a - b)
        : acc.movements;
    movs.forEach(function (mov, i) {
        const type = mov > 0 ? 'deposit' : 'withdrawal';
        //Display dates
        const date = new Date(acc.movementsDates[i]);
        const displayDate = formatMovementDate(date);
        const formattedMov = formatCurrency(mov, acc.locale, acc.currency);
        const html = ` <div class="movements__row">
  <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
  <div class="movements__date">${displayDate}</div>
  <div class="movements__value">${formattedMov}</div>
</div>`;
        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
};
// Create username
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
const updateUI = function (currentAccount) {
    //Calculate numbers
    displayMovements(currentAccount);
    calcPrintBalance(currentAccount);
    calcDisplaySum(currentAccount);
};
//Display Balance
const calcPrintBalance = function (acc) {
    acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
    const formattedMov = formatCurrency(acc.balance, acc.locale, acc.currency);
    labelBalance.textContent = `${formattedMov}`;
};
const calcDisplaySum = function (acc) {
    //Income
    const incomes = acc.movements
        .filter(mov => mov > 0)
        .reduce((acc, mov) => acc + mov, 0);
    labelSumIn.textContent = formatCurrency(incomes, acc.locale, acc.currency);
    //Out
    const out = acc.movements
        .filter(mov => mov < 0)
        .reduce((acc, mov) => acc + mov, 0);
    labelSumOut.textContent = formatCurrency(out, acc.locale, acc.currency);
    //Interest
    const interest = acc.movements
        .filter(mov => mov > 0)
        .map(deposit => (deposit * acc.interestRate) / 100)
        .filter((int, i, arr) => {
        return int >= 1;
    })
        .reduce((acc, int) => acc + int, 0);
    labelSumInterest.textContent = formatCurrency(interest, acc.locale, acc.currency);
};
//Logout timer
const startLogoutTimer = function () {
    const tick = function () {
        const mins = String(Math.trunc(timer / 60)).padStart(2, '0');
        const secs = String(timer % 60).padStart(2, '0');
        labelTimer.textContent = `${mins}:${secs}`;
        //Logout once we reach 0
        if (timer === 0) {
            clearInterval(timing);
            labelWelcome.textContent = 'Log in to get started';
            containerApp.style.display = 'none';
            loginTooltip.style.display = 'block';
            loginForm.style.display = 'flex';
            navContainer.style.marginTop = '10%';
        }
        timer--;
    };
    //set time to 5 min
    let timer = 100;
    tick();
    const timing = setInterval(tick, 1000);
    return timing;
};
//Lougout with logout button
btnLogout.addEventListener('click', function () {
    labelWelcome.textContent = 'Log in to get started';
    containerApp.style.display = 'none';
    loginForm.style.display = 'flex';
    loginTooltip.style.display = 'block';
    navContainer.style.marginTop = '10%';
});
// Login functionality
btnLogin.addEventListener('click', function (e) {
    //prevent form from submiting
    e.preventDefault();
    currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
    ///Login validation
    let bothInputsEmpty = inputLoginUsername.value.length === 0 && inputLoginPin.value.length === 0;
    let usernameEmpty = inputLoginUsername.value.length === 0;
    let passwordEmpty = inputLoginPin.value.length === 0;
    if (bothInputsEmpty) {
        inputLoginUsername.classList.add('warning');
        inputLoginPin.classList.add('warning');
        warningText.textContent = 'Empty Username and Password!';
    }
    else if (usernameEmpty && !passwordEmpty) {
        inputLoginUsername.classList.add('warning');
        inputLoginPin.classList.remove('warning');
        warningText.textContent = 'Empty Username!';
    }
    else if (passwordEmpty && !usernameEmpty) {
        inputLoginUsername.classList.remove('warning');
        inputLoginPin.classList.add('warning');
        warningText.textContent = 'Empty Password!';
    }
    else if (!currentAccount && !bothInputsEmpty) {
        inputLoginUsername.classList.add('warning');
        inputLoginPin.classList.add('warning');
        warningText.textContent = "Account with such username doesn't exist!";
    }
    /// if validation passed
    else {
        inputLoginUsername.classList.remove('warning');
        inputLoginPin.classList.remove('warning');
        warningText.textContent = ' ';
        if ((currentAccount === null || currentAccount === void 0 ? void 0 : currentAccount.pin) === Number(inputLoginPin.value)) {
            labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}!`;
            //Show hidden container
            loginForm.style.display = 'none';
            containerApp.style.display = 'grid';
            loginTooltip.style.display = 'none';
            navContainer.style.marginTop = '5%';
            //Create current date
            const now = new Date();
            const day = `${now.getDate()}`.padStart(2, '0');
            const month = `${now.getMonth() + 1}`.padStart(2, '0');
            const year = now.getFullYear();
            const hour = `${now.getHours()}`.padStart(2, '0');
            const min = `${now.getMinutes()}`.padStart(2, '0');
            labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;
            updateUI(currentAccount);
            //Clear input
            inputLoginUsername.value = inputLoginPin.value = '';
            inputLoginPin.blur();
            //clear time if it started on another acc
            if (timing)
                clearInterval(timing);
            //Start logout
            timing = startLogoutTimer();
        }
    }
});
//Tranfer money functionality
btnTransfer.addEventListener('click', function (e) {
    e.preventDefault();
    const amount = Number(inputTransferAmount.value);
    const recieverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
    inputTransferAmount.value = inputTransferTo.value = '';
    if (currentAccount) {
        const balance = currentAccount.balance;
        if (balance) {
            if (amount > 0 &&
                recieverAcc &&
                balance >= amount &&
                recieverAcc.username !== currentAccount.username) {
                //Transfer
                currentAccount.movements.push(-amount);
                recieverAcc.movements.push(amount);
                //Add transfer date
                currentAccount.movementsDates.push(new Date().toISOString());
                recieverAcc.movementsDates.push(new Date().toISOString());
                updateUI(currentAccount);
                //Reset timer on action
                clearInterval(timing);
                timing = startLogoutTimer();
            }
        }
    }
});
// Close account functionality
btnClose.addEventListener('click', function (e) {
    e.preventDefault();
    if (currentAccount) {
        const username = currentAccount.username;
        if (username &&
            inputCloseUsername.value === username &&
            Number(inputClosePin.value) === currentAccount.pin) {
            const index = accounts.findIndex(acc => acc.username === username);
            accounts.splice(index, 1);
            loginForm.style.display = 'flex';
            containerApp.style.display = 'none';
            navContainer.style.marginTop = '10%';
        }
    }
    inputCloseUsername.value = inputClosePin.value = '';
});
// Loadn functionality
btnLoan.addEventListener('click', function (e) {
    e.preventDefault();
    const inputLoanAmountValue = +inputLoanAmount.value;
    if (!currentAccount) {
        // Handle the case where currentAccount is undefined (e.g., show an error message)
        console.error('Current account is undefined');
        return;
    }
    if (inputLoanAmountValue) {
        const amount = Math.floor(inputLoanAmountValue);
        const movements = currentAccount.movements;
        if (movements) {
            if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
                // Set timer for loan
                const currentAcc = currentAccount;
                setTimeout(function () {
                    // Add movement
                    currentAcc.movements.push(amount);
                    // Add loan date
                    if (currentAcc.movementsDates) {
                        currentAcc.movementsDates.push(new Date().toISOString());
                    }
                    // Update UI
                    updateUI(currentAcc);
                    // Reset timer on action
                    clearInterval(timing);
                    timing = startLogoutTimer();
                }, 2500);
            }
        }
    }
    inputLoanAmount.value = '';
});
// Sort functionality
btnSort.addEventListener('click', function (e) {
    e.preventDefault();
    if (currentAccount) {
        displayMovements(currentAccount, !sorted);
        sorted = !sorted;
    }
});
